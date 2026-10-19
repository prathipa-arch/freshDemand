import React, { useState } from 'react';
import { CrispStage, UserRole, MarkdownAlertItem, UploadedExcelFile } from './types';
import { MARKDOWN_ALERTS_INITIAL } from './data/mockData';
import { mapExcelToSystemData, ProcessedExcelSystemData } from './utils/excelDataMapper';
import { Header } from './components/Header';
import { OverviewDashboard } from './components/OverviewDashboard';
import { BusinessUnderstandingView } from './components/BusinessUnderstandingView';
import { DataPrepView } from './components/DataPrepView';
import { AIDemandForecastingView } from './components/AIDemandForecastingView';
import { ModelingView } from './components/ModelingView';
import { EvaluationView } from './components/EvaluationView';
import { DeploymentView } from './components/DeploymentView';
import { ExcelUploader } from './components/ExcelUploader';
import { ScenarioSimulatorModal } from './components/ScenarioSimulatorModal';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { AIClassifierModal } from './components/AIClassifierModal';

export default function App() {
  const [currentStage, setCurrentStage] = useState<CrispStage>('overview');
  const [currentRole, setCurrentRole] = useState<UserRole>('store_manager');
  const [crowdBufferPct, setCrowdBufferPct] = useState<number>(15);
  const [markdownAlerts, setMarkdownAlerts] = useState<MarkdownAlertItem[]>(MARKDOWN_ALERTS_INITIAL);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isExecutiveReportOpen, setIsExecutiveReportOpen] = useState(false);
  const [isAIClassifierOpen, setIsAIClassifierOpen] = useState(false);
  const [activeExcelDataset, setActiveExcelDataset] = useState<ProcessedExcelSystemData | null>(null);

  const handleExcelUploaded = (fileData: UploadedExcelFile) => {
    const processed = mapExcelToSystemData(fileData);
    setActiveExcelDataset(processed);
    setMarkdownAlerts(processed.markdownAlerts);
  };

  const handleClearExcelData = () => {
    setActiveExcelDataset(null);
    setMarkdownAlerts(MARKDOWN_ALERTS_INITIAL);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-['Prompt',sans-serif]">
      {/* Top Application Header */}
      <Header
        currentStage={currentStage}
        onSelectStage={setCurrentStage}
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        markdownAlertsCount={markdownAlerts.filter(m => m.posAlertStatus === 'Active').length}
        onOpenMarkdownAlerts={() => setCurrentStage('inventory_waste')}
        crowdBufferPct={crowdBufferPct}
        onChangeCrowdBuffer={setCrowdBufferPct}
        onOpenExcelUpload={() => setIsExcelModalOpen(true)}
        activeExcelName={activeExcelDataset?.uploadedFile.fileName}
        onClearActiveExcel={handleClearExcelData}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenExecutiveReport={() => setIsExecutiveReportOpen(true)}
        onOpenAIClassifier={() => setIsAIClassifierOpen(true)}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentStage === 'overview' && (
          <OverviewDashboard
            onNavigateStage={setCurrentStage}
            crowdBufferPct={crowdBufferPct}
            onChangeCrowdBuffer={setCrowdBufferPct}
            markdownCount={markdownAlerts.length}
            onOpenExcelUpload={() => setIsExcelModalOpen(true)}
            excelDataset={activeExcelDataset}
            onClearExcelData={handleClearExcelData}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onOpenExecutiveReport={() => setIsExecutiveReportOpen(true)}
            onOpenAIClassifier={() => setIsAIClassifierOpen(true)}
          />
        )}

        {currentStage === 'data_prep' && (
          <DataPrepView
            excelDataset={activeExcelDataset}
            onExcelUploaded={handleExcelUploaded}
            onClearExcelData={handleClearExcelData}
          />
        )}

        {currentStage === 'forecasting' && (
          <AIDemandForecastingView
            excelDataset={activeExcelDataset}
            crowdBufferPct={crowdBufferPct}
          />
        )}

        {currentStage === 'modeling' && (
          <ModelingView excelDataset={activeExcelDataset} />
        )}

        {currentStage === 'evaluation' && (
          <EvaluationView excelDataset={activeExcelDataset} />
        )}

        {(currentStage === 'inventory_waste' || (currentStage as string) === 'deployment') && (
          <DeploymentView
            currentRole={currentRole}
            markdownAlerts={markdownAlerts}
            onUpdateMarkdownAlerts={setMarkdownAlerts}
            excelDataset={activeExcelDataset}
          />
        )}
      </main>

      {/* System Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Fresh Food Demand & Waste Reduction AI System • Standard CRISP-DM Framework
          </div>
          <div className="flex items-center gap-3">
            <span>
              Data Engine:{' '}
              <strong className="text-emerald-400">
                {activeExcelDataset 
                  ? `Excel: ${activeExcelDataset.uploadedFile.fileName} (${activeExcelDataset.summary.totalRows.toLocaleString()} Rows)`
                  : '100,000 Rows Active'}
              </strong>
            </span>
          </div>
        </div>
      </footer>

      {/* Global Excel Uploader Modal */}
      {isExcelModalOpen && (
        <ExcelUploader
          isOpenAsModal={true}
          onCloseModal={() => setIsExcelModalOpen(false)}
          onFileUploaded={handleExcelUploaded}
          onNavigateStage={(stage) => {
            setCurrentStage(stage);
            setIsExcelModalOpen(false);
          }}
        />
      )}

      {/* What-If Scenario Simulator Modal */}
      <ScenarioSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        baseCrowdBuffer={crowdBufferPct}
      />

      {/* Executive One-Page Report Modal */}
      <ExecutiveReportModal
        isOpen={isExecutiveReportOpen}
        onClose={() => setIsExecutiveReportOpen(false)}
        excelDataset={activeExcelDataset}
      />

      {/* AI Smart Data Classifier & Clustering Modal */}
      <AIClassifierModal
        isOpen={isAIClassifierOpen}
        onClose={() => setIsAIClassifierOpen(false)}
        excelDataset={activeExcelDataset}
      />
    </div>
  );
}
