import React, { useState } from 'react';
import { 
  X, 
  GitPullRequest, 
  GitBranch, 
  CheckCircle2, 
  Code2, 
  Terminal, 
  ExternalLink,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Incident, SuggestedFix } from '../types';

interface PRDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident;
  fix: SuggestedFix;
  onSubmitSuccess: () => void;
}

export default function PRDrawer({ isOpen, onClose, incident, fix, onSubmitSuccess }: PRDrawerProps) {
  const [prState, setPrState] = useState<'review' | 'submitting' | 'success'>('review');
  const [prNumber] = useState<number>(() => Math.floor(100 + Math.random() * 900));

  if (!isOpen) return null;

  const branchName = `gecko/fix-${incident.id.toLowerCase()}-${fix.filePath.split('.')[0]}`;
  const prTitle = `[Gecko] Resolve ${incident.title} (${incident.id})`;

  // Submitting logic
  const handleOpenPR = () => {
    setPrState('submitting');
    setTimeout(() => {
      setPrState('success');
    }, 2000);
  };

  const handleFinish = () => {
    onSubmitSuccess();
    onClose();
    setPrState('review');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans flex select-none">
      {/* Background backing overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Drawer content sliding in from right */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 md:pl-16">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col h-full transform transition-all border-l border-[#c2c6d6]">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#eceef0] bg-[#f8fafc] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-[#0062d6]">
              <GitPullRequest className="w-5 h-5" />
              <h2 className="text-sm font-bold text-[#191c1e] tracking-tight uppercase">Review Gecko Proposed PR</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-[#727785] hover:text-[#191c1e] p-1.5 hover:bg-[#eceef0] rounded-md transition-all cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Body Content Scrollable Area */}
          <div className="flex-grow p-6 overflow-y-auto space-y-6">

            {prState === 'review' && (
              <>
                {/* PR Configuration parameters */}
                <div className="space-y-3.5 bg-[#f8fafc] p-4 border border-[#c2c6d6] rounded-lg text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#727785] font-semibold text-[10px] tracking-wider uppercase">Repository branch</span>
                    <span className="font-mono bg-[#eceef0] text-[#191c1e] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                      <GitBranch className="w-3 h-3 text-[#424754]" />
                      {branchName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#eceef0] pt-3">
                    <span className="text-[#727785] font-semibold text-[10px] tracking-wider uppercase">Destination branch</span>
                    <span className="font-mono bg-[#eceef0] text-[#191c1e] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                      <GitBranch className="w-3 h-3 text-[#424754]" />
                      main
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 border-t border-[#eceef0] pt-3">
                    <span className="text-[#727785] font-semibold text-[10px] tracking-wider uppercase">Pull Request Title</span>
                    <span className="font-sans text-xs text-[#191c1e] font-bold">
                      {prTitle}
                    </span>
                  </div>
                </div>

                {/* PR Markdown Description Box preview */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-sans font-bold text-[#727785] tracking-wider uppercase">AI Generated PR Description Summary</h3>
                  <div className="bg-white border border-[#c2c6d6] rounded-lg p-4 font-sans text-xs text-[#424754] leading-relaxed space-y-2 max-h-48 overflow-y-auto">
                    <p className="font-bold text-[#191c1e]">#{incident.id} Resolution Context:</p>
                    <p>Gecko triggered automated AST parsing and compiled a codebase configuration patch for the target file <code className="font-mono bg-[#eceef0] px-1 rounded">{fix.filePath}</code>. This resolves connection vulnerabilities by executing the recommended parameter alignments:</p>
                    <ul className="list-disc list-inside space-y-1.5">
                      <li>Upgrades the resources configurations to handle high traffic peaks safely.</li>
                      <li>Imposes strict bounds to prevent stack failures under resource contentions.</li>
                      <li>Ensures all local compiler checks pass green.</li>
                    </ul>
                    <p className="border-t border-[#eceef0] pt-2 text-[10px] text-[#727785] italic font-medium">Drafted autonomously in 2.1s by Gecko Triage module.</p>
                  </div>
                </div>

                {/* Micro Diff Preview inside the review drawer */}
                <div className="space-y-2 font-sans">
                  <h3 className="text-[10px] font-bold text-[#727785] tracking-wider uppercase">Patch Diff Review</h3>
                  
                  <div className="border border-[#c2c6d6] rounded-lg overflow-hidden text-xs">
                    <div className="bg-[#f8fafc] px-3 py-1.5 text-[11px] font-mono border-b border-[#c2c6d6] text-[#727785]">
                      {fix.filePath}
                    </div>
                    <div className="font-mono text-[11px] bg-[#1e1e1e] text-white p-2.5 space-y-1 h-36 overflow-y-auto leading-relaxed">
                      {fix.diff.map((line, idx) => {
                        let colorClass = 'text-white/60';
                        if (line.type === 'added') colorClass = 'text-green-300 bg-[#1b432e]/50';
                        if (line.type === 'removed') colorClass = 'text-red-300 bg-[#4c1f1f]/50';
                        return (
                          <div key={idx} className={`${colorClass} font-mono px-1`}>
                            {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '} {line.content}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}

            {prState === 'submitting' && (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center select-none font-sans">
                <Loader2 className="w-12 h-12 text-[#0062d6] animate-spin" />
                <div>
                  <h4 className="text-sm font-bold text-[#191c1e]">Opening Pull Request...</h4>
                  <p className="text-xs text-[#727785] mt-1 leading-snug">Writing code patch, resolving git hooks, and publishing the Gecko patch branch to remote origin.</p>
                </div>
              </div>
            )}

            {prState === 'success' && (
              <div className="py-12 space-y-6 text-center font-sans animate-fade-in flex flex-col items-center">
                <div className="w-16 h-16 bg-[#1a7f37]/10 rounded-full flex items-center justify-center border-2 border-green-600/20">
                  <CheckCircle2 className="w-10 h-10 text-[#1a7f37]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#191c1e]">PR #{prNumber} Opened Successfully!</h3>
                  <p className="text-xs text-[#424754] px-6 leading-relaxed">
                    Gecko has successfully opened the pull request to the codebase repository on destination branch <span className="font-mono bg-[#eceef0] px-1 rounded font-bold">main</span>.
                  </p>
                </div>

                <div className="font-mono border border-dashed border-[#c2c6d6] rounded-lg p-4 bg-[#f8fafc] text-xs text-[#424754] w-full text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">STATUS:</span>
                    <span className="text-[#1a7f37] font-bold">● DRAFT PR OPEN</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">AUTHOR:</span>
                    <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-[#0062d6]" /> Gecko Triage Agent</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 text-xs text-[#0062d6] hover:underline cursor-pointer font-bold">
                    View on GitHub Repo
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Drawer Actions Footer */}
          <div className="px-6 py-4.5 border-t border-[#eceef0] bg-[#f8fafc] flex justify-end gap-3 shrink-0">
            {prState === 'review' && (
              <>
                <button 
                  onClick={onClose}
                  className="px-4 py-2 border border-[#c2c6d6] text-[#424754] bg-white rounded text-xs font-semibold hover:bg-[#eceef0] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleOpenPR}
                  className="px-6 py-2 bg-[#0062d6] hover:bg-[#004ba7] text-white rounded text-xs font-semibold transition-all cursor-pointer shadow-sm flex items-center gap-2 active:scale-95"
                >
                  <GitPullRequest className="w-4 h-4" />
                  Open Suggested PR
                </button>
              </>
            )}

            {prState === 'success' && (
              <button 
                onClick={handleFinish}
                className="w-full py-2 bg-[#0062d6] hover:bg-[#004ba7] text-white rounded text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                Return to Operational Control
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
