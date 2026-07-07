const fs = require('fs');
const filePath = 'c:/ProjectCoding/nexarin/features/pdf-tools/components/MergeWorkspace.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import for thumbnail generator
if (!content.includes('generatePdfThumbnail')) {
  content = content.replace(
    'import { processMergePdf } from "@/features/pdf-tools/core/pdf-processing";',
    'import { processMergePdf } from "@/features/pdf-tools/core/pdf-processing";\nimport { generatePdfThumbnail } from "@/features/pdf-tools/core/pdf-thumbnail";'
  );
}

// 2. Add state for thumbnails
if (!content.includes('const [thumbnails, setThumbnails]')) {
  content = content.replace(
    'const [errorMsg, setErrorMsg] = useState(\'\');',
    'const [errorMsg, setErrorMsg] = useState(\'\');\n  const [thumbnails, setThumbnails] = useState({});'
  );
}

// 3. Update handleFileSelection to generate thumbnails
const handleFileSelectionTarget = `    if (pdfFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...pdfFiles]);
      setProcessingState('idle');
      setProgress(0);
      setProcessedResult(null);
      setErrorMsg('');
    }`;

const handleFileSelectionReplacement = `    if (pdfFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...pdfFiles]);
      
      // Async generate thumbnails
      pdfFiles.forEach(async (file) => {
        const key = \`\${file.name}-\${file.size}\`;
        const dataUrl = await generatePdfThumbnail(file);
        if (dataUrl) {
           setThumbnails(prev => ({ ...prev, [key]: dataUrl }));
        }
      });

      setProcessingState('idle');
      setProgress(0);
      setProcessedResult(null);
      setErrorMsg('');
    }`;
content = content.replace(handleFileSelectionTarget, handleFileSelectionReplacement);

// 4. Hide big Upload Zone when selectedFiles.length > 0
content = content.replace(
  /\{\/\* Upload Zone \*\/\}\r?\n\s*<div\s+className=\{\`relative flex flex-col/,
  `{/* Upload Zone */}
                {selectedFiles.length === 0 && (
                <div 
                  className={\`relative flex flex-col`
);

// Close the if condition for Upload Zone
// Right after the button "Pilih File PDF", there's `</div>` then `{/* Preview & Arrange Grid */}`
content = content.replace(
  /Pilih File PDF\r?\n\s*<\/button>\r?\n\s*<\/div>\r?\n\r?\n\s*\{\/\* Preview & Arrange Grid \*\/\}/,
  `Pilih File PDF
                  </button>
                </div>
                )}

                {/* Preview & Arrange Grid */}`
);

// 5. Update Grid visual to use Thumbnail, absolute position "Hal", and add (+) button
const gridItemVisualTarget = `{/* PDF Visual Representation */}
                          <div className="aspect-[3/4] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-2 border-slate-200/20 flex flex-col items-center justify-center relative overflow-hidden mb-4 group-hover:scale-[1.02] group-hover:shadow-[0_8px_30px_rgba(239,68,68,0.2)] transition-all duration-300">
                            {/* Decorative Red Document Header */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-rose-400" />
                            
                            <FileType className="w-12 h-12 text-slate-300 mb-3 drop-shadow-sm" />
                            <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full tracking-widest uppercase border border-slate-100 shadow-sm">
                              Hal {idx + 1}
                            </span>
                          </div>`;

const gridItemVisualReplacement = `{/* PDF Visual Representation */}
                          <div className="aspect-[3/4] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-2 border-slate-200/20 flex flex-col items-center justify-center relative overflow-hidden mb-4 group-hover:scale-[1.02] group-hover:shadow-[0_8px_30px_rgba(239,68,68,0.2)] transition-all duration-300">
                            {/* Decorative Red Document Header */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-rose-400 z-10" />
                            
                            {thumbnails[\`\${file.name}-\${file.size}\`] ? (
                              <img src={thumbnails[\`\${file.name}-\${file.size}\`]} alt="Preview PDF" className="w-full h-full object-cover animate-in fade-in duration-500" />
                            ) : (
                              <div className="flex flex-col items-center justify-center animate-pulse">
                                <Loader2 className="w-8 h-8 text-slate-300 animate-spin mb-2" />
                              </div>
                            )}

                            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-500 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full tracking-widest uppercase border border-slate-200 shadow-sm z-10">
                              Hal {idx + 1}
                            </span>
                          </div>`;
content = content.replace(gridItemVisualTarget, gridItemVisualReplacement);

const addFileCardTarget = `                        </div>
                      ))}
                    </div>`;

const addFileCardReplacement = `                        </div>
                      ))}

                      {/* Add File Card */}
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative border-2 border-dashed border-slate-700/60 hover:border-red-500/50 hover:bg-red-500/5 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 aspect-[3/4] md:aspect-auto"
                      >
                         <div className="w-16 h-16 rounded-full bg-slate-800/80 group-hover:bg-red-500/20 flex items-center justify-center mb-4 transition-colors shadow-sm group-hover:scale-110">
                            <FilePlus className="w-8 h-8 text-slate-400 group-hover:text-red-400 transition-colors" />
                         </div>
                         <p className="text-sm font-bold text-slate-400 group-hover:text-red-400 transition-colors text-center">
                            Tambah<br/>File
                         </p>
                      </div>

                    </div>`;
content = content.replace(addFileCardTarget, addFileCardReplacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log('MergeWorkspace updated.');
