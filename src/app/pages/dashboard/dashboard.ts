import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';


const ALL_MODULES = [
  { name:"MD Dashboard", cat:"Management", icon:"📊", color:"#4ade80", glow:"rgba(74,222,128,0.15)", link:"https://datastudio.google.com/reporting/c792587c-61c4-40da-98ac-3e0a81575251/page/WJfiF" },
  { name:"System Master", cat:"Admin", icon:"⚙️", color:"#60a5fa", glow:"rgba(96,165,250,0.15)", link:"https://docs.google.com/spreadsheets/d/1bYt6_1tDfy9EaF3YJ7FOq0mTXRYSwFpQ7aXYSBBUIuw/edit" },
  { name:"Delegation Sheet", cat:"HR & Teams", icon:"🌿", color:"#34d399", glow:"rgba(52,211,153,0.15)", link:"https://datastudio.google.com/reporting/1993c19a-fb04-4547-b546-fbc23a74dca0/page/p_0v6dqhwyyd" },
  { name:"Checklist System", cat:"Operations", icon:"✅", color:"#f59e0b", glow:"rgba(245,158,11,0.15)", link:"https://datastudio.google.com/reporting/1993c19a-fb04-4547-b546-fbc23a74dca0/page/WJfiF" },
  { name:"Task List", cat:"Productivity", icon:"📋", color:"#a78bfa", glow:"rgba(167,139,250,0.15)", link:"https://datastudio.google.com/reporting/c792587c-61c4-40da-98ac-3e0a81575251/page/p_ph9sgpbqzd" },
  { name:"Lead Referral", cat:"Sales", icon:"🤝", color:"#fb923c", glow:"rgba(251,146,60,0.15)", link:"https://datastudio.google.com/reporting/c792587c-61c4-40da-98ac-3e0a81575251/page/p_ze7g833xzd" },
  { name:"FMS List", cat:"Field Mgmt", icon:"🗺️", color:"#4ade80", glow:"rgba(74,222,128,0.15)", link:"https://datastudio.google.com/reporting/1993c19a-fb04-4547-b546-fbc23a74dca0/page/p_kcj92u2azd" },
  { name:"Purchase FMS", cat:"Procurement", icon:"🛒", color:"#34d399", glow:"rgba(52,211,153,0.15)", link:"https://datastudio.google.com/reporting/1993c19a-fb04-4547-b546-fbc23a74dca0/page/p_6jkhesymzd" },
  { name:"Remote Working FMS", cat:"Remote Ops", icon:"🌐", color:"#60a5fa", glow:"rgba(96,165,250,0.15)", link:"https://datastudio.google.com/reporting/1993c19a-fb04-4547-b546-fbc23a74dca0/page/p_il5abm9ozd" },
  { name:"MIS Scores", cat:"Analytics", icon:"📈", color:"#f59e0b", glow:"rgba(245,158,11,0.15)", link:"https://datastudio.google.com/reporting/c792587c-61c4-40da-98ac-3e0a81575251/page/p_6z9koc72yd" },
  { name:"Accounts Dashboard", cat:"Finance", icon:"💰", color:"#fb923c", glow:"rgba(251,146,60,0.15)", link:"https://datastudio.google.com/reporting/3b11ce1c-f0ca-4e50-bb15-fc51e0add293/page/WJfiF" },
  { name:"CRM", cat:"Customers", icon:"👥", color:"#a78bfa", glow:"rgba(167,139,250,0.15)", link:"https://datastudio.google.com/reporting/12f4a201-4c13-45e0-bf40-c95dc9b076ea/page/p_9ncu3rdm0d" },
  { name:"PC Dashboard", cat:"Operations", icon:"🖥️", color:"#4ade80", glow:"rgba(74,222,128,0.15)", link:"https://datastudio.google.com/reporting/986d961e-e035-4fca-83d2-b98065a342bd/page/p_0v6dqhwyyd/edit" },
  { name:"EA Dashboard", cat:"Executive", icon:"📉", color:"#f59e0b", glow:"rgba(245,158,11,0.15)", link:"https://datastudio.google.com/reporting/81be8efd-1d20-4d33-94e4-dfe147c7aebd/page/p_0v6dqhwyyd/edit" },
  { name:"Tax Invoice FMS", cat:"Finance", icon:"🧾", color:"#60a5fa", glow:"rgba(96,165,250,0.15)", link:"https://docs.google.com/spreadsheets/d/15akhpOmEoY9MQAZcQ-NVklhBqQJKhB8Lh5LLkGDWMvw/edit" },
];

const ROW1_NAMES = ["MD Dashboard","System Master","Delegation Sheet","Checklist System","Task List","Lead Referral"];
const ROW2_NAMES = ["FMS List","Purchase FMS","Remote Working FMS","MIS Scores","Accounts Dashboard","CRM"];
const ROW3_NAMES = ["PC Dashboard","EA Dashboard","Tax Invoice FMS"];

// ── CSV Links ──────────────────────────────────────────────────────
// Delegation sheet  → Name, Email, Dept, Task ID, Planned, Actual, Status ...
const DELEGATION_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLBQsF9AIt5SIsKmSEGOlKEs34jdHwhbsN9aNw-7fUQcu3cbhhkADDXYccL3Of17zwPQQJcC-4Crbr/pub?gid=2092959791&single=true&output=csv';
// Checklist sheet   → Task ID, Timestamp  (row exists = task completed)
const CHECKLIST_CSV  = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLBQsF9AIt5SIsKmSEGOlKEs34jdHwhbsN9aNw-7fUQcu3cbhhkADDXYccL3Of17zwPQQJcC-4Crbr/pub?output=csv';

// ── Exact columns from your sheet ─────────────────────────────────
// Name | Email | Department | Task ID | Freq | Task |
// Planned | Actual | Status | Email For Buddy System | Buddy Email | Second Assignee Name

export interface EmpRow {
  name: string;
  email: string;
  department: string;
  taskId: string;
  freq: string;
  task: string;
  planned: string;
  actual: string;
  status: string;
  buddyEmail: string;
  buddyEmail2: string;
  secondAssignee: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  visibleModules: typeof ALL_MODULES = [];
  row1: typeof ALL_MODULES = [];
  row2: typeof ALL_MODULES = [];
  row3: typeof ALL_MODULES = [];

  userRole = '';
  today = '';

  // ── data ──────────────────────────────────────────────────────────
  allRows: EmpRow[] = [];
  filteredRows: EmpRow[] = [];
  completedTaskIds = new Map<string, string>(); // taskId -> timestamp
  isLoading = true;
  loadError = false;

  // ── filters ───────────────────────────────────────────────────────
  employees: string[] = [];
  selectedEmployees: string[] = [];
  showEmpDropdown = false;
  dateFrom = '';
  dateTo   = '';

  // ── stats ─────────────────────────────────────────────────────────
  checklistCompleted      = 0;
  checklistPending        = 0;
  delegationAssigned      = 0;
  delegationCompleted     = 0;
  delegationCompletionPct = 0;
  delegationPending       = 0;
  delegationOverdue       = 0;

  private timer: any;

  ngOnInit() {
    const allowed = this.authService.getUserModules();
    this.userRole = this.authService.getUserRole();
    this.visibleModules = ALL_MODULES.filter(m => allowed.includes(m.name));
    this.row1 = this.visibleModules.filter(m => ROW1_NAMES.includes(m.name));
    this.row2 = this.visibleModules.filter(m => ROW2_NAMES.includes(m.name));
    this.row3 = this.visibleModules.filter(m => ROW3_NAMES.includes(m.name));

    const d = new Date();
    this.today = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const iso = d.toISOString().split('T')[0];
    this.dateFrom = iso;
    this.dateTo   = iso;

    this.fetchCSV();
  }

  ngOnDestroy() { clearInterval(this.timer); }

  // ── Fetch both CSVs in parallel ───────────────────────────────────
 async fetchCSV() {
    this.isLoading = true;
    this.loadError = false;
    try {
      console.log('Fetching CSVs...');
      
      // Agar checklist fail ho jaye, toh kam se kam employees toh load honge!
      const [delegRes, checkRes] = await Promise.all([
        fetch(DELEGATION_CSV),
        fetch(CHECKLIST_CSV).catch(err => {
          console.warn('Checklist fetch failed, but continuing...', err);
          return new Response(''); // Fallback text
        })
      ]);

      const [delegText, checkText] = await Promise.all([
        delegRes.text(),
        checkRes.text(),
      ]);

      console.log('Delegation Data Length:', delegText.length);

      // Parse delegation sheet
      this.allRows = this.parseCSV(delegText);

      // Parse checklist sheet
      this.completedTaskIds = this.parseChecklistCSV(checkText);

      console.log('Total Rows Parsed:', this.allRows.length); 

      this.buildEmployeeList();
      this.applyFilters();
      
      // UI ko force update karein
      this.cdr.detectChanges(); 
      
    } catch (e) {
      console.error('CRITICAL ERROR in fetchCSV:', e);
      this.loadError = true;
      this.cdr.detectChanges();
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  // ── Parse Checklist CSV (Task ID, Timestamp) ───────────────────────
  // Returns a Map<taskId, timestamp> for quick lookup
  private parseChecklistCSV(csv: string): Map<string, string> {
    const map = new Map<string, string>();
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return map;

    const headers = this.splitCSVLine(lines[0]).map(h =>
      h.replace(/^\uFEFF/, '').replace(/"/g, '').trim().toLowerCase()
    );

    const C_TASKID    = headers.indexOf('task id');
    const C_TIMESTAMP = headers.indexOf('timestamp');

    console.log('Checklist headers:', headers, '| taskid col:', C_TASKID, '| ts col:', C_TIMESTAMP);

    for (let i = 1; i < lines.length; i++) {
      const cols = this.splitCSVLine(lines[i]);
      if (cols.length < 2) continue;
      const taskId    = (cols[C_TASKID]    ?? '').replace(/"/g, '').trim();
      const timestamp = (cols[C_TIMESTAMP] ?? '').replace(/"/g, '').trim();
      if (taskId) map.set(taskId, timestamp);
    }
    return map;
  }

  // ── Parse CSV ─────────────────────────────────────────────────────
  // ── Parse CSV ─────────────────────────────────────────────────────
 private parseCSV(csv: string): EmpRow[] {
    // Hidden \r (carriage returns) ko completely hata diya
    const lines = csv.replace(/\r/g, '').trim().split('\n');
    if (lines.length < 2) return [];

    // Headers ko strict clean aur lowercase kar diya
    const headers = this.splitCSVLine(lines[0]).map(h =>
      h.replace(/^\uFEFF/, '').replace(/"/g, '').trim().toLowerCase()
    );

    console.log('Cleaned Headers Array:', headers); 

    // Sab kuch strict small letters mein
    const C_NAME       = headers.indexOf('name');
    const C_EMAIL      = headers.indexOf('email');
    const C_DEPT       = headers.indexOf('department');
    const C_TASKID     = headers.indexOf('task id');
    const C_FREQ       = headers.indexOf('freq');
    const C_TASK       = headers.indexOf('task');
    const C_PLANNED    = headers.indexOf('planned');
    const C_ACTUAL     = headers.indexOf('actual');
    const C_STATUS     = headers.indexOf('status');
    const C_BUDDY1     = headers.indexOf('email for buddy system');
    const C_BUDDY2     = headers.indexOf('buddy email');
    const C_SECOND     = headers.indexOf('second assignee name');

    console.log('Index of Name Column:', C_NAME); // Agar yeh -1 aaya, toh header match nahi hua

    const rows: EmpRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = this.splitCSVLine(lines[i]);
      if (cols.length < 2) continue;

      const g = (idx: number) =>
        idx >= 0 ? (cols[idx] ?? '').replace(/"/g, '').trim() : '';

      const name = g(C_NAME);
      if (!name) continue; // skip empty rows

      rows.push({
        name,
        email:          g(C_EMAIL),
        department:     g(C_DEPT),
        taskId:         g(C_TASKID),
        freq:           g(C_FREQ),
        task:           g(C_TASK),
        planned:        g(C_PLANNED),
        actual:         g(C_ACTUAL),
        status:         g(C_STATUS),
        buddyEmail:     g(C_BUDDY1),
        buddyEmail2:    g(C_BUDDY2),
        secondAssignee: g(C_SECOND),
      });
    }

    return rows;
  }

  // ── CSV line splitter (handles quoted commas) ─────────────────────
  private splitCSVLine(line: string): string[] {
    const result: string[] = [];
    let cur = '', inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { result.push(cur); cur = ''; }
      else { cur += ch; }
    }
    result.push(cur);
    return result;
  }

  // ── Employee list ─────────────────────────────────────────────────
  private buildEmployeeList() {
    const names = [
      ...new Set(this.allRows.map(r => r.name).filter(n => !!n))
    ].sort();
    this.employees = names;
    this.selectedEmployees = [...names];
    console.log('Employees:', this.employees);
  }



  // ── Filters + Stats ───────────────────────────────────────────────
  applyFilters() {
    let rows = [...this.allRows];

    // 1. Employee filter
    if (this.selectedEmployees.length > 0) {
      rows = rows.filter(r => this.selectedEmployees.includes(r.name));
    }

    // 2. Date range on "Planned" column (DD/MM/YYYY)
    if (this.dateFrom) {
      const from = new Date(this.dateFrom);
      from.setHours(0, 0, 0, 0);
      rows = rows.filter(r => {
        const d = this.parsePlannedDate(r.planned);
        return d ? d >= from : true;
      });
    }
    if (this.dateTo) {
      const to = new Date(this.dateTo);
      to.setHours(23, 59, 59, 999);
      rows = rows.filter(r => {
        const d = this.parsePlannedDate(r.planned);
        return d ? d <= to : true;
      });
    }

    this.filteredRows = rows;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ── DELEGATION stats (from Status column) ─────────────────────
    // Status === 'Done' → Completed
    // Status empty + Planned < today → Overdue
    // Status empty + Planned >= today → Pending
    const delegCompleted = rows.filter(r => r.status.trim().toLowerCase() === 'done').length;
    const delegIncomplete = rows.filter(r => r.status.trim() === '');
    const delegOverdue   = delegIncomplete.filter(r => {
      const d = this.parsePlannedDate(r.planned);
      return d ? d < today : false;
    }).length;
    const delegPending   = delegIncomplete.filter(r => {
      const d = this.parsePlannedDate(r.planned);
      return d ? d >= today : true;
    }).length;
    const delegTotal = rows.length;
    const delegPct   = delegTotal > 0 ? Math.round((delegCompleted / delegTotal) * 100) : 0;

    this.delegationAssigned      = delegTotal;
    this.delegationCompleted     = delegCompleted;
    this.delegationPending       = delegPending;
    this.delegationOverdue       = delegOverdue;
    this.delegationCompletionPct = delegPct;

    // ── CHECKLIST stats (from checklist sheet Task ID + Timestamp) ─
    // Total checklist tasks = rows that have a Task ID
    // Completed today = Task ID exists in completedTaskIds
    //                   AND timestamp date === today
    const todayStr = today.toLocaleDateString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }); // matches DD/MM/YYYY format in timestamp

    const rowsWithTaskId = rows.filter(r => r.taskId && r.taskId.trim() !== '');
    const checkTotal = rowsWithTaskId.length;

    const checkCompletedToday = rowsWithTaskId.filter(r => {
      const ts = this.completedTaskIds.get(r.taskId.trim());
      if (!ts) return false;
      // Timestamp format: DD/MM/YYYY HH:MM:SS
      // Check if timestamp date matches selected date range
      const tsDate = ts.split(' ')[0]; // "DD/MM/YYYY"
      const parsed = this.parsePlannedDate(tsDate);
      if (!parsed) return false;
      // Within selected date range
      let inRange = true;
      if (this.dateFrom) {
        const from = new Date(this.dateFrom); from.setHours(0,0,0,0);
        inRange = inRange && parsed >= from;
      }
      if (this.dateTo) {
        const to = new Date(this.dateTo); to.setHours(23,59,59,999);
        inRange = inRange && parsed <= to;
      }
      return inRange;
    }).length;

    this.checklistCompleted = checkCompletedToday;
    this.checklistPending   = checkTotal - checkCompletedToday;
  }

  // Parse DD/MM/YYYY format (Planned column)
  private parsePlannedDate(s: string): Date | null {
    if (!s) return null;
    const m = s.trim().match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (m) {
      const d = new Date(`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`);
      d.setHours(0, 0, 0, 0);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  }

  // ── Dropdown helpers ──────────────────────────────────────────────
  toggleEmpDropdown() { this.showEmpDropdown = !this.showEmpDropdown; }

  toggleEmployee(name: string) {
    const i = this.selectedEmployees.indexOf(name);
    if (i >= 0) this.selectedEmployees.splice(i, 1);
    else this.selectedEmployees.push(name);
    this.applyFilters();
  }

  isEmpSelected(name: string) { return this.selectedEmployees.includes(name); }

  selectAllEmployees() { this.selectedEmployees = [...this.employees]; this.applyFilters(); }
  clearAllEmployees()  { this.selectedEmployees = []; this.applyFilters(); }

  get empDropdownLabel(): string {
    const s = this.selectedEmployees, e = this.employees;
    if (s.length === 0)        return 'No employee selected';
    if (s.length === e.length) return 'All Employees';
    if (s.length === 1)        return s[0];
    return `${s.length} employees selected`;
  }

  onDateChange() { this.applyFilters(); }
  logout() { this.authService.logout(); }
}