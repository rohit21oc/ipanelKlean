import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy {
  private authService = inject(AuthService);

  visibleModules: typeof ALL_MODULES = [];
  row1: typeof ALL_MODULES = [];
  row2: typeof ALL_MODULES = [];
  row3: typeof ALL_MODULES = [];

  userRole = '';
  today = '';
  // Checklist Task Summary
  checklistCompleted = 0;
  checklistPending = 35;

  // Delegation Task Summary
  delegationAssigned = 0;
  delegationCompleted = 0;
  delegationCompletionPct = 0;
  delegationPending = 304;
  delegationOverdue = 298;
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

  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  logout() {
    this.authService.logout();
  }
}