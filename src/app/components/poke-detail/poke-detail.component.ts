import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'poke-detail',
  templateUrl: './poke-detail.component.html',
  styleUrls: ['./poke-detail.component.css']
})
export class PokeDetailComponent implements OnInit {

  rowRatio: number;

  constructor(
    public dialogRef: MatDialogRef<PokeDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit(): void {
    this.rowRatio = (window.innerWidth <= 500) ? 2 : 10;
  }

  onResize(event) {
    this.rowRatio = (event.target.innerWidth <= 500) ? 2 : 10;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
