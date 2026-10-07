import React, { useState } from 'react';
import { Search, Edit3, CheckCircle2, FileSpreadsheet, ExternalLink, RotateCcw } from 'lucide-react';
import { DiseaseItem, LevelFeedback, FeedbackChoice } from '../types';

interface CriteriaTableProps {
  diseases: DiseaseItem[];
  feedback: Record<string, LevelFeedback>;
  onSelectChoice: (diseaseId: string, levelId: string, choice: FeedbackChoice) => void;
  onCommentChange: (diseaseId: string, levelId: string, comment: string) => void;
  onOpenSATModal: (disease: DiseaseItem) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  onConnectAndOpenSheet?: () => void;
  activeSheetUrl?: string | null;
  lastSavedTime?: string;
  onClearResponses?: () => void;
}

export const CriteriaTable: React.FC<CriteriaTableProps> = ({
  diseases,
  feedback,
  onSelectChoice,
  onCommentChange,
  onOpenSATModal,
  onSubmit,
  isSubmitting = false,
  onConnectAndOpenSheet,
  activeSheetUrl,
  lastSavedTime,
  onClearResponses,
}) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const getLevelBg = (levelName: string) => {
    if (levelName.includes('อำเภอ')) return 'bg-slate-50/80';
    if (levelName.includes('จังหวัด')) return 'bg-blue-50/40';
    if (levelName.includes('เขต')) return 'bg-amber-50/50';
    if (levelName.includes('ส่วนกลาง')) return 'bg-emerald-50/40';
    return 'bg-white';
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs min-w-[1300px]">
          {/* Header */}
          <thead>
            <tr className="border-b border-slate-300 font-bold text-slate-800 text-center">
              <th className="w-14 p-3 bg-[#eef2f6] border-r border-slate-200">
                รายการที่
              </th>
              <th className="w-48 p-3 bg-[#f3efe6] border-r border-slate-200 text-left">
                โรค / เหตุการณ์
              </th>
              <th className="w-56 p-3 bg-[#fce7f3] text-rose-950 border-r border-rose-200 text-left">
                เกณฑ์ตรวจสอบข่าว SAT
              </th>
              <th className="w-24 p-3 bg-[#e0e7ff] text-indigo-950 border-r border-indigo-200">
                ระดับ
              </th>
              <th className="w-64 p-3 bg-[#fef3c7] text-amber-950 border-r border-amber-200 text-left">
                เกณฑ์เดิม สคร.1 (ธ.ค. 2568)
              </th>
              <th className="w-64 p-3 bg-[#d1fae5] text-emerald-950 border-r border-emerald-200 text-left">
                เกณฑ์ใหม่ กองระบาดวิทยา (ก.ย. 2569)
              </th>
              <th className="w-24 p-3 bg-[#ecfdf5] text-emerald-900 border-r border-slate-200">
                สถานะ
                <span className="block text-[10px] font-normal text-slate-500">
                  (คงเดิม/ปรับเปลี่ยน)
                </span>
              </th>
              <th className="p-2.5 bg-[#fef9c3] text-amber-950 border-l-2 border-amber-400">
                <div className="text-center font-bold text-xs text-amber-950 mb-1">
                  ความคิดเห็นของท่านสำหรับการปรับข้อนี้: <span className="text-red-500">*</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold text-slate-700 bg-white/70 p-1.5 rounded-lg border border-amber-200">
                  <div className="text-center">
                    คงเกณฑ์เดิม สคร.1
                    <span className="block text-[10px] font-normal text-slate-500">(ใช้ฉบับ ธ.ค. 68)</span>
                  </div>
                  <div className="text-center">
                    ปรับตามร่างใหม่
                    <span className="block text-[10px] font-normal text-slate-500">(ใช้ฉบับ ก.ย. 69)</span>
                  </div>
                  <div className="text-center">
                    ปรับแก้แบบผสมผสาน
                    <span className="block text-[10px] font-normal text-slate-500">(เสนอข้อความใหม่)</span>
                  </div>
                </div>
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-200">
            {diseases.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500 bg-slate-50">
                  ไม่พบรายการโรคหรือเหตุการณ์ตามเงื่อนไขที่เลือก
                </td>
              </tr>
            ) : (
              diseases.map((disease) => {
                const totalLevels = disease.levels.length;

                return disease.levels.map((lvl, lvlIndex) => {
                  const key = `${disease.id}_${lvl.id}`;
                  const currentFeedback = feedback[key];
                  const choice = currentFeedback?.choice;
                  const isFirstRow = lvlIndex === 0;

                  return (
                    <tr
                      key={key}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        lvlIndex === totalLevels - 1 ? 'border-b-2 border-slate-300' : 'border-b border-slate-200'
                      }`}
                    >
                      {/* รายการที่ (Rowspan) */}
                      {isFirstRow && (
                        <td
                          rowSpan={totalLevels}
                          className="p-3 text-center font-bold text-slate-700 border-r border-slate-200 bg-slate-50/50 align-top"
                        >
                          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-extrabold flex items-center justify-center mx-auto text-xs">
                            {disease.no}
                          </div>
                        </td>
                      )}

                      {/* โรค / เหตุการณ์ (Rowspan) */}
                      {isFirstRow && (
                        <td
                          rowSpan={totalLevels}
                          className="p-3.5 border-r border-slate-200 align-top bg-white"
                        >
                          <div className="font-bold text-slate-900 text-sm leading-snug">
                            {disease.name}
                          </div>
                          {disease.nameEn && (
                            <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                              ({disease.nameEn})
                            </div>
                          )}
                          <div className="mt-2.5">
                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              {disease.groupName}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* เกณฑ์ตรวจสอบข่าว SAT (Rowspan) */}
                      {isFirstRow && (
                        <td
                          rowSpan={totalLevels}
                          className="p-3.5 border-r border-slate-200 align-middle text-center bg-rose-50/20"
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => onOpenSATModal(disease)}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white bg-[#b91c1c] hover:bg-[#991b1b] shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
                            >
                              <Search className="w-3.5 h-3.5" />
                              <span>ดูเกณฑ์ SAT (3 ระดับ)</span>
                            </button>
                            <span className="text-[10px] text-slate-500 font-medium leading-tight">
                              สคร.1 • SMEs • DCIR
                            </span>
                          </div>
                        </td>
                      )}

                      {/* ระดับ */}
                      <td
                        className={`p-3 text-center font-bold text-slate-800 border-r border-slate-200 ${getLevelBg(
                          lvl.level
                        )}`}
                      >
                        <span className="inline-block px-2.5 py-1 rounded-md bg-white/90 text-slate-800 border border-slate-200/80 shadow-2xs font-semibold">
                          {lvl.level}
                        </span>
                      </td>

                      {/* เกณฑ์เดิม สคร.1 (ธ.ค. 2568) */}
                      <td className="p-3 text-slate-800 border-r border-slate-200 leading-relaxed bg-[#fffdf5]">
                        {lvl.originalCriteria}
                      </td>

                      {/* เกณฑ์ใหม่ กองระบาดวิทยา (ก.ย. 2569) */}
                      <td
                        className={`p-3 border-r border-slate-200 leading-relaxed ${
                          lvl.status === 'ปรับเปลี่ยน'
                            ? 'text-red-600 font-semibold bg-rose-50/40'
                            : 'text-slate-800 bg-[#f6fef9]'
                        }`}
                      >
                        {lvl.newCriteria}
                      </td>

                      {/* สถานะ (คงเดิม / ปรับเปลี่ยน) */}
                      <td className="p-3 text-center border-r border-slate-200">
                        {lvl.status === 'ปรับเปลี่ยน' ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            ปรับเปลี่ยน
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
                            คงเดิม
                          </span>
                        )}
                      </td>

                      {/* ความคิดเห็น (3 columns: คงเกณฑ์เดิม, ปรับตามร่างใหม่, ผสมผสาน) */}
                      <td className="p-2 border-l-2 border-amber-400 bg-amber-50/20">
                        <div className="grid grid-cols-3 gap-2">
                          {/* Option 1: คงเกณฑ์เดิม */}
                          <button
                            type="button"
                            onClick={() => onSelectChoice(disease.id, lvl.id, 'original')}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center cursor-pointer ${
                              choice === 'original'
                                ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mb-1 transition-colors ${
                                choice === 'original'
                                  ? 'border-blue-600 bg-blue-600'
                                  : 'border-slate-400 bg-white'
                              }`}
                            >
                              {choice === 'original' && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                              )}
                            </div>
                            <span className="text-[11px] font-semibold leading-tight">
                              คงเกณฑ์เดิม
                            </span>
                          </button>

                          {/* Option 2: ปรับตามร่างใหม่ */}
                          <button
                            type="button"
                            onClick={() => onSelectChoice(disease.id, lvl.id, 'new')}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center cursor-pointer ${
                              choice === 'new'
                                ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mb-1 transition-colors ${
                                choice === 'new'
                                  ? 'border-blue-600 bg-blue-600'
                                  : 'border-slate-400 bg-white'
                              }`}
                            >
                              {choice === 'new' && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                              )}
                            </div>
                            <span className="text-[11px] font-semibold leading-tight">
                              ปรับตามร่างใหม่
                            </span>
                          </button>

                          {/* Option 3: ผสมผสาน */}
                          <button
                            type="button"
                            onClick={() => onSelectChoice(disease.id, lvl.id, 'hybrid')}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center cursor-pointer ${
                              choice === 'hybrid'
                                ? 'bg-amber-50 border-amber-600 text-amber-950 shadow-xs ring-1 ring-amber-500'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mb-1 transition-colors ${
                                choice === 'hybrid'
                                  ? 'border-amber-600 bg-amber-600'
                                  : 'border-slate-400 bg-white'
                              }`}
                            >
                              {choice === 'hybrid' && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                              )}
                            </div>
                            <span className="text-[11px] font-semibold leading-tight">
                              ผสมผสาน
                            </span>
                          </button>
                        </div>

                        {/* Input Box for Hybrid choice */}
                        {choice === 'hybrid' && (
                          <div className="mt-2.5 p-2 bg-amber-50/90 rounded-lg border border-amber-300/80 animate-in fade-in duration-150">
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-900 mb-1">
                              <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                              <span>ระบุเกณฑ์ที่เสนอปรับแก้ หรือเหตุผลประกอบ:</span>
                            </div>
                            <textarea
                              rows={2}
                              value={currentFeedback?.comment || ''}
                              onChange={(e) => onCommentChange(disease.id, lvl.id, e.target.value)}
                              placeholder="พิมพ์เสนอข้อความเกณฑ์ใหม่ หรือข้อเสนอแนะเพิ่มเติม..."
                              className="w-full text-xs p-2 rounded-md border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 placeholder:text-slate-400"
                            ></textarea>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                });
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Action footer */}
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>จัดเก็บข้อมูลอัตโนมัติแล้ว (Auto-saved) • ไม่สูญหายเมื่อโหลดหน้าใหม่หรือ Refresh</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {lastSavedTime || 'ทุกการเลือกความคิดเห็นจะถูกบันทึกไว้ในระบบทันที และพร้อมส่งข้อมูลไปยัง Google Sheets'}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onClearResponses && Object.keys(feedback).length > 0 && (
            <>
              {showConfirmClear ? (
                <div className="flex items-center gap-1.5 p-1 bg-amber-50 rounded-lg border border-amber-300">
                  <span className="text-[11px] text-amber-900 font-medium px-1">ยืนยันล้างคำตอบ?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClearResponses();
                      setShowConfirmClear(false);
                    }}
                    className="px-2 py-1 text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                  >
                    ล้าง
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmClear(false)}
                    className="px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-200 rounded transition-colors"
                  >
                    ยกเลิก
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirmClear(true)}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  title="ล้างคำตอบเพื่อเริ่มทำใหม่"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ล้างคำตอบ</span>
                </button>
              )}
            </>
          )}

          {/* Quick Google Sheets link button */}
          {onConnectAndOpenSheet && (
            <>
              {activeSheetUrl ? (
                <a
                  href={activeSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow transition-all"
                  title="เปิดดูข้อมูลที่บันทึกใน Google Sheets"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                  <span>เปิด Google Sheet ทันที</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onConnectAndOpenSheet}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow transition-all cursor-pointer active:scale-95"
                  title="เชื่อมต่อและเปิด Google Sheet ทันที"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>ลิ้งค์ไปที่ Google Sheet ทันที</span>
                </button>
              )}
            </>
          )}

          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'กำลังบันทึกข้อมูล...' : 'บันทึกและส่งข้อมูลความคิดเห็น'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
