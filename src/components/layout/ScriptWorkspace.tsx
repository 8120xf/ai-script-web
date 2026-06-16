import type { ReactNode } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useScripts } from '../../context/ScriptContext';
import { GENRE_LABEL } from '../../utils/mock';

const TABS = [
  { key: 'info', path: 'info', label: '基础信息' },
  { key: 'analyze', path: 'analyze', label: '分析任务' },
  { key: 'module1', path: 'module1', label: '观察报告' },
  { key: 'module2', path: 'module2', label: '情绪曲线' },
  { key: 'cyclesheet', path: 'cyclesheet', label: '情节结构' },
];

interface ScriptWorkspaceProps {
  children: ReactNode;
  pageTitle?: string;
  pageSub?: string;
  actions?: ReactNode;
}

export default function ScriptWorkspace({
  children,
  pageTitle,
  pageSub,
  actions,
}: ScriptWorkspaceProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getScript } = useScripts();
  const script = getScript(Number(id));

  const activeTab =
    TABS.find((t) => location.pathname.includes(`/${t.path}`))?.key ?? 'info';

  if (!script) {
    return <div style={{ padding: 48, textAlign: 'center', color: '#6b6560' }}>剧本不存在</div>;
  }

  return (
    <div className="script-workspace">
      <button
        type="button"
        className="script-workspace-back"
        onClick={() => navigate('/scripts')}
      >
        ← 剧本列表
      </button>

      <h1 className="script-workspace-title">{script.title}</h1>
      <p className="script-workspace-meta">
        {GENRE_LABEL[script.genre] || script.genre}
        {script.tier ? ` · ${script.tier} 级` : ''}
        · {script.total_episodes} 集
      </p>

      <nav className="script-workspace-tabs" aria-label="剧本工作区导航">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`script-workspace-tab${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => navigate(`/scripts/${id}/${tab.path}`)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {(pageTitle || actions) && (
        <div className="script-workspace-toolbar">
          <div>
            {pageTitle && (
              <h2 className="script-workspace-page-title">{pageTitle}</h2>
            )}
            {pageSub && (
              <p className="script-workspace-page-sub">{pageSub}</p>
            )}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}

      {children}
    </div>
  );
}
