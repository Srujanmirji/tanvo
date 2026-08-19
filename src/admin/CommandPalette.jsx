import { useEffect, useState } from 'react';
import {
  CreditCard,
  Database,
  FileCheck2,
  Inbox,
  Kanban,
  Layers,
  LayoutDashboard,
  Package,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import { useContent } from '../lib/store';

export default function CommandPalette({ isOpen, onClose, onSelectTab, onTriggerAction }) {
  const { leads = [], clients = [], invoices = [], services = [], caseStudies = [] } = useContent();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global Keyboard Listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const defaultCommands = [
    // Navigation items
    { id: 'nav-pipeline', label: 'Go to Projects & Pipeline Board', category: 'Navigation', icon: LayoutDashboard, action: () => onSelectTab('pipeline') },
    { id: 'nav-leads', label: 'Go to CRM Leads Funnel', category: 'Navigation', icon: Kanban, action: () => onSelectTab('leads') },
    { id: 'nav-clients', label: 'Go to Client Accounts Directory', category: 'Navigation', icon: Users, action: () => onSelectTab('clients') },
    { id: 'nav-deliverables', label: 'Go to Deliverables & Approvals', category: 'Navigation', icon: FileCheck2, action: () => onSelectTab('deliverables') },
    { id: 'nav-invoices', label: 'Go to Invoicing & Billing Manager', category: 'Navigation', icon: CreditCard, action: () => onSelectTab('invoices') },
    { id: 'nav-services', label: 'Go to Services Catalog CMS', category: 'Navigation', icon: Package, action: () => onSelectTab('services') },
    { id: 'nav-portfolio', label: 'Go to Portfolio & Case Studies CMS', category: 'Navigation', icon: Layers, action: () => onSelectTab('casestudies') },
    { id: 'nav-inbox', label: 'Go to Applications & Inbound Inbox', category: 'Navigation', icon: Inbox, action: () => onSelectTab('inbox') },
    { id: 'nav-data', label: 'Go to Data Backup & Tools', category: 'Navigation', icon: Database, action: () => onSelectTab('data') },

    // Quick Actions
    { id: 'act-new-lead', label: 'Action: Create New Inbound Lead', category: 'Actions', icon: Plus, action: () => onTriggerAction('new-lead') },
    { id: 'act-new-client', label: 'Action: Add New Client Account', category: 'Actions', icon: Plus, action: () => onTriggerAction('new-client') },
    { id: 'act-new-invoice', label: 'Action: Issue New Milestone Invoice', category: 'Actions', icon: Plus, action: () => onTriggerAction('new-invoice') },
    { id: 'act-new-service', label: 'Action: Add Service Offering to Catalog', category: 'Actions', icon: Plus, action: () => onTriggerAction('new-service') },
    { id: 'act-new-cs', label: 'Action: Publish New Case Study', category: 'Actions', icon: Plus, action: () => onTriggerAction('new-casestudy') },
  ];

  // Dynamic search items from active records
  const dynamicResults = [];
  if (query.trim()) {
    const q = query.toLowerCase();

    leads.filter((l) => l.name.toLowerCase().includes(q) || l.company?.toLowerCase().includes(q)).forEach((l) => {
      dynamicResults.push({
        id: `lead-${l.id}`,
        label: `Lead: ${l.company || l.name} (${l.status})`,
        category: 'CRM Leads',
        icon: Kanban,
        action: () => onSelectTab('leads'),
      });
    });

    clients.filter((c) => c.name.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q)).forEach((c) => {
      dynamicResults.push({
        id: `client-${c.id}`,
        label: `Client: ${c.company || c.name} [${c.accessCode}]`,
        category: 'Clients',
        icon: Users,
        action: () => onSelectTab('clients'),
      });
    });

    services.filter((s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)).forEach((s) => {
      dynamicResults.push({
        id: `srv-${s.id}`,
        label: `Service: ${s.name} (${s.category})`,
        category: 'Services CMS',
        icon: Package,
        action: () => onSelectTab('services'),
      });
    });

    caseStudies.filter((cs) => cs.title.toLowerCase().includes(q) || cs.clientName.toLowerCase().includes(q)).forEach((cs) => {
      dynamicResults.push({
        id: `cs-${cs.id}`,
        label: `Case Study: ${cs.title} (${cs.clientName})`,
        category: 'Case Studies',
        icon: Layers,
        action: () => onSelectTab('casestudies'),
      });
    });

    invoices.filter((i) => i.invoiceNumber.toLowerCase().includes(q) || i.title.toLowerCase().includes(q)).forEach((i) => {
      dynamicResults.push({
        id: `inv-${i.id}`,
        label: `Invoice ${i.invoiceNumber}: ${i.title}`,
        category: 'Invoices',
        icon: CreditCard,
        action: () => onSelectTab('invoices'),
      });
    });
  }

  const allItems = [...dynamicResults, ...defaultCommands];
  const filtered = allItems.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()),
  );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      filtered[selectedIndex].action();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4"
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-slate-950 shadow-2xl backdrop-blur-2xl">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3.5">
          <Search size={16} className="text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search (leads, invoices, clients, services)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[340px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center font-mono text-xs text-slate-500">
              No matching modules or records found
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs text-left transition ${
                    isSelected
                      ? 'border border-cyan-500/30 bg-cyan-500/15 text-cyan-300 font-medium'
                      : 'text-slate-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={14} className={isSelected ? 'text-cyan-400' : 'text-slate-500'} />
                    <span>{cmd.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{cmd.category}</span>
                </button>
              );
            })
          )}
        </div>

        <div className="border-t border-white/5 bg-white/[0.01] px-4 py-2 text-right text-[10px] text-slate-500 font-mono">
          Navigate with &uarr;&darr; &bull; Enter to select
        </div>
      </div>
    </div>
  );
}
