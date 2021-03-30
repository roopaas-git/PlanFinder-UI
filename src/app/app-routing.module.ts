import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanfinderComponent } from './views/planFinder/planfinder.component';
import { SampleGridComponent } from './views/TestGrid/sample-grid.component';
import { TestComponent } from './views/Test/test.component';
import { TableComponent } from './views/tableRowSpan/table.component';

const routes: Routes = [
  { path: 'planFinder/:userId', component: PlanfinderComponent },
  { path: 'grid', component: SampleGridComponent },
  { path: 'test/:userId', component: TestComponent },
  { path: 'table', component: TableComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
