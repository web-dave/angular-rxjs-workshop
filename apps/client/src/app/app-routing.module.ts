import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
  UrlMatcher,
  UrlMatchResult,
  UrlSegment
} from '@angular/router';
import { FooComponent } from './foo/foo.component';
import { MatchaComponent } from './matcha/matcha.component';
import { OneComponent } from './one/one.component';
import { StartComponent } from './start/start.component';
import { ThreeComponent } from './three/three.component';
import { TwoComponent } from './two/two.component';

const matchaMatcher: UrlMatcher = (
  url: UrlSegment[]
): UrlMatchResult | null => {
  if (url.length === 1 && url[0].path.includes('matcha')) {
    const result: UrlMatchResult = {
      consumed: url,
      posParams: {
        foo: new UrlSegment('bar', {}),
        matcha: new UrlSegment(url[0].path.replace('matcha', ''), {})
      }
    };
    return result;
  }
  return null;
};

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'todos' },
  { component: MatchaComponent, matcher: matchaMatcher },
  // { path: ':matcha', component: MatchaComponent },
  {
    path: 'start',
    component: StartComponent,
    children: [
      {
        path: '',
        component: OneComponent,
        children: [
          {
            path: '',
            component: TwoComponent,
            children: [{ path: '', component: ThreeComponent }]
          },
          { path: 'foo', component: FooComponent }
        ]
      }
    ]
  },
  {
    path: 'todos',
    loadChildren: () =>
      import('./todos/internals/todos.module').then((m) => m.TodosModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
