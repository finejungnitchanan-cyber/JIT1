import React from 'react';
import { Contact, Info, CheckCircle2, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { RespondentInfo } from '../types';

interface RespondentInfoCardProps {
  respondent: RespondentInfo;
  onChange: (field: keyof RespondentInfo, value: string) => void;
  answeredCount: number;
  totalCount: number;
  isFilteringChanged?: boolean;
  filterContextLabel?: string;
  lastSavedTime?: string;
  onConnectAndOpenSheet?: () => void;
  activeSheetUrl?: string | null;
}

export const RespondentInfoCard: React.FC<RespondentInfoCardProps> = ({
  respondent,
  onChange,
  answeredCount,
  totalCount,
  isFilteringChanged = false,
  filterContextLabel,
  lastSavedTime,
  onConnectAndOpenSheet,
  activeSheetUrl,
}) => {
  const percentage = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/90 p-5 mb-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Form: Respondent Info */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#193b68] font-bold text-base">
                <Contact className="w-5 h-5 text-blue-600" />
                <span>ข้อมูลผู้แสดงความคิดเห็น (สมาชิกทีม JIT)</span>
              </div>

              {/* Auto-save status */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>จัดเก็บข้อมูลทันที (ไม่หายเมื่อ Refresh)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ชื่อ-นามสกุล <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={respondent.fullName}
                  onChange={(e) => onChange('fullName', e.target.value)}
                  placeholder="ระบุชื่อ-นามสกุล"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ตำแหน่ง / กลุ่มงาน / หน่วยงาน <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={respondent.positionOrg}
                  onChange={(e) => onChange('positionOrg', e.target.value)}
                  placeholder="เช่น นายแพทย์ชำนาญการ กลุ่มระบาดวิทยาฯ"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Quick link to Google Sheets in Respondent card */}
          {onConnectAndOpenSheet && (
            <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500">
                {lastSavedTime ? (
                  <span>{lastSavedTime}</span>
                ) : (
                  <span>ระบบบันทึกคำตอบอัตโนมัติลงเครื่องทุกครั้งที่มีการกดเลือก</span>
                )}
              </span>

              {activeSheetUrl ? (
                <a
                  href={activeSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition-colors shadow-2xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>เปิด Google Sheet ทันที</span>
                  <ExternalLink className="w-3 h-3 text-emerald-600" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onConnectAndOpenSheet}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>ลิ้งค์ไปที่ Google Sheet ทันที</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Info Box: Instructions & Progress */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#eff6ff] to-[#e0f2fe] rounded-xl p-4 border border-blue-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-start gap-2 text-blue-900 font-semibold text-xs sm:text-sm mb-1.5">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>คำแนะนำการแสดงความคิดเห็น</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed pl-6">
              โปรดพิจารณาเปรียบเทียบเกณฑ์ในแต่ละระดับ (อำเภอ, จังหวัด, เขต, ส่วนกลาง) และทำเครื่องหมาย
              เลือกทิศทางที่เห็นควร พร้อมระบุข้อเสนอแนะเพิ่มเติมได้ในช่องแบบผสมผสาน
            </p>
          </div>

          <div className="mt-3.5 pt-3 border-t border-blue-200/60 pl-6">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
              <span className="text-blue-950 font-semibold flex flex-wrap items-center gap-1.5">
                <span>ความคืบหน้าการตอบ:</span>
                {filterContextLabel && (
                  <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-1.5 py-0.2 rounded-md">
                    {filterContextLabel}
                  </span>
                )}
                {isFilteringChanged && (
                  <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded-md">
                    เฉพาะเกณฑ์ที่มีการเปลี่ยนแปลง
                  </span>
                )}
              </span>
              <span className="font-bold text-blue-800">
                {answeredCount} / {totalCount} ข้อ ({percentage}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-blue-100/80 rounded-full overflow-hidden border border-blue-200/50">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isFilteringChanged
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                }`}
                style={{ width: `${Math.min(100, percentage)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
