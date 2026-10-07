import { SubmissionRecord, DiseaseItem } from '../types';

const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';
const STORAGE_SHEET_ID_KEY = 'odpc1_jit_active_sheet_id';

export interface GoogleSheetSyncResult {
  success: boolean;
  spreadsheetId: string;
  spreadsheetUrl: string;
  rowsAdded: number;
  message?: string;
}

export const getSavedSheetId = (): string | null => {
  return localStorage.getItem(STORAGE_SHEET_ID_KEY);
};

export const setSavedSheetId = (id: string) => {
  localStorage.setItem(STORAGE_SHEET_ID_KEY, id);
};

export async function createNewSpreadsheet(accessToken: string, title?: string): Promise<{ id: string; url: string }> {
  const sheetTitle = title || `แบบทบทวนเกณฑ์สอบสวนโรค JIT สคร.1 เชียงใหม่ (บันทึก ${new Date().toLocaleDateString('th-TH')})`;
  
  const response = await fetch(SHEETS_API_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: sheetTitle,
      },
      sheets: [
        {
          properties: {
            title: 'ผลการตอบแบบสอบถาม JIT',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'ไม่สามารถสร้าง Google Sheets ได้');
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Write headers
  const headers = [
    'วันเวลาที่ตอบ',
    'ชื่อ-นามสกุล',
    'ตำแหน่ง / หน่วยงาน',
    'อีเมลผู้ตอบ',
    'รหัสกลุ่ม',
    'กลุ่มโรค',
    'โรค / เหตุการณ์',
    'ระดับ',
    'สถานะเกณฑ์',
    'ความคิดเห็นที่เลือก',
    'เกณฑ์เดิม สคร.1 (ธ.ค. 68)',
    'เกณฑ์ใหม่ กองระบาด (ก.ย. 69)',
    'ข้อเสนอแนะเพิ่มเติม / เกณฑ์เสนอใหม่',
  ];

  await fetch(`${SHEETS_API_BASE}/${spreadsheetId}/values/A1:M1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range: 'A1:M1',
      majorDimension: 'ROWS',
      values: [headers],
    }),
  });

  setSavedSheetId(spreadsheetId);
  return { id: spreadsheetId, url: spreadsheetUrl };
}

export async function appendResponsesToSheet(
  accessToken: string,
  submission: SubmissionRecord,
  allDiseases: DiseaseItem[],
  customSpreadsheetId?: string
): Promise<GoogleSheetSyncResult> {
  let spreadsheetId = customSpreadsheetId || getSavedSheetId();
  let spreadsheetUrl = '';

  if (!spreadsheetId) {
    const newSheet = await createNewSpreadsheet(accessToken);
    spreadsheetId = newSheet.id;
    spreadsheetUrl = newSheet.url;
  } else {
    spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  }

  // Build rows from submission responses
  const rows: any[][] = [];
  const timeFormatted = new Date(submission.createdAt).toLocaleString('th-TH');

  for (const disease of allDiseases) {
    for (const lvl of disease.levels) {
      const respKey = `${disease.id}_${lvl.id}`;
      const feedback = submission.responses[respKey];

      if (feedback) {
        let choiceText = 'ไม่ได้ระบุ';
        if (feedback.choice === 'original') choiceText = 'คงเกณฑ์เดิม สคร.1 (ธ.ค. 68)';
        else if (feedback.choice === 'new') choiceText = 'ปรับตามร่างใหม่ (ก.ย. 69)';
        else if (feedback.choice === 'hybrid') choiceText = 'ปรับแก้แบบผสมผสาน (เสนอข้อความใหม่)';

        rows.push([
          timeFormatted,
          submission.respondent.fullName || '-',
          submission.respondent.positionOrg || '-',
          submission.respondent.email || '-',
          disease.groupId,
          disease.groupName,
          disease.name,
          lvl.level,
          lvl.status,
          choiceText,
          lvl.originalCriteria,
          lvl.newCriteria,
          feedback.comment || '',
        ]);
      }
    }
  }

  if (rows.length === 0) {
    return {
      success: true,
      spreadsheetId,
      spreadsheetUrl,
      rowsAdded: 0,
      message: 'ไม่มีข้อมูลความเห็นที่ถูกบันทึก',
    };
  }

  const appendRes = await fetch(
    `${SHEETS_API_BASE}/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rows,
      }),
    }
  );

  if (!appendRes.ok) {
    const errorData = await appendRes.json();
    throw new Error(errorData.error?.message || 'ไม่สามารถบันทึกข้อมูลลงใน Google Sheets ได้');
  }

  return {
    success: true,
    spreadsheetId,
    spreadsheetUrl,
    rowsAdded: rows.length,
    message: `บันทึกข้อมูลสำเร็จ ${rows.length} รายการลง Google Sheets`,
  };
}
