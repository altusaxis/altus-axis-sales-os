import Papa from 'papaparse';
import { supabase } from '@/lib/supabase/client';

export interface UnmappedLeadRow {
  [key: string]: string;
}

const COLUMN_MAPPINGS: Record<string, string[]> = {
  first_name: ['first name', 'given name', 'fname', 'first'],
  last_name: ['last name', 'surname', 'lname', 'last'],
  practice_name: ['practice name', 'company', 'clinic', 'business name', 'practice'],
  email: ['email', 'email address', 'e-mail'],
  website: ['website', 'url', 'web', 'site'],
  phone: ['phone', 'telephone', 'mobile', 'phone number'],
  city: ['city', 'town', 'location'],
  country: ['country', 'nation'],
  speciality: ['speciality', 'specialty', 'niche', 'focus'],
  linkedin: ['linkedin', 'linkedin url', 'profile'],
  notes: ['notes', 'comments', 'description']
};

export function normalizeHeaders(headers: string[]): Record<string, string> {
  const mapped: Record<string, string> = {};
  
  headers.forEach((header) => {
    const cleanHeader = header.trim().toLowerCase();
    let found = false;
    
    for (const [targetField, aliases] of Object.entries(COLUMN_MAPPINGS)) {
      if (aliases.includes(cleanHeader)) {
        mapped[header] = targetField;
        found = true;
        break;
      }
    }
    if (!found) mapped[header] = cleanHeader.replace(/\s+/g, '_');
  });
  
  return mapped;
}

export async function processCSVImport(file: File, userId: string) {
  return new Promise<{ imported: number; updated: number }>((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rawData = results.data as UnmappedLeadRow[];
          if (rawData.length === 0) resolve({ imported: 0, updated: 0 });

          const rawHeaders = Object.keys(rawData[0]);
          const headerMap = normalizeHeaders(rawHeaders);
          
          let imported = 0;
          let updated = 0;

          for (const row of rawData) {
            const normalizedRow: Record<string, any> = { user_id: userId };
            
            Object.keys(row).forEach((key) => {
              const mappedKey = headerMap[key];
              if (mappedKey) normalizedRow[mappedKey] = row[key];
            });

            if (!normalizedRow.email) continue;

            // Upsert / Duplicate Resolution via Supabase
            const { data: existing } = await supabase
              .from('leads')
              .select('id, notes')
              .eq('user_id', userId)
              .eq('email', normalizedRow.email)
              .maybeSingle();

            if (existing) {
              // Append notes if new notes exist
              const combinedNotes = normalizedRow.notes 
                ? `${existing.notes || ''}\n[Import Note]: ${normalizedRow.notes}`.trim()
                : existing.notes;

              await supabase
                .from('leads')
                .update({ ...normalizedRow, notes: combinedNotes, updated_at: new Date().toISOString() })
                .eq('id', existing.id);
                
              updated++;
            } else {
              const { data: newLead } = await supabase
                .from('leads')
                .insert([normalizedRow])
                .select()
                .single();

              if (newLead) {
                await supabase.from('lead_activities').insert({
                  lead_id: newLead.id,
                  user_id: userId,
                  type: 'imported',
                  title: 'Lead Imported',
                  description: `Imported via CSV file: ${file.name}`
                });
              }
              imported++;
            }
          }
          resolve({ imported, updated });
        } catch (err) {
          reject(err);
        }
      },
      error: (err) => reject(err)
    });
  });
}