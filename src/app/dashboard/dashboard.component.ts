import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "../service/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);
    profile: any;

    ngOnInit(): void {
        new Promise(resolve => setTimeout(resolve, 1000)).then(r => this.showData());
    }

    showData() {
        this.profile = this.authService.getProfile();
        console.log(this.profile);
    }

    async logOut() {
        this.authService.logout();
        await new Promise(resolve => setTimeout(resolve, 5000));
        this.router.navigate(['/login']);
    }
}
