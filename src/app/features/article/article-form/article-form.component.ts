import { Component, OnInit, ViewChild, ElementRef,Input, AfterViewInit,ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { Observable } from 'rxjs';
import { catchError, map,startWith } from 'rxjs/operators';
import Quill from 'quill';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { TagService } from '../../../core/services/tag.service';
import { minimumTagsValidator } from '../../../core/validators/MiniumTagValidator';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleFormComponent implements OnInit, AfterViewInit {
  @ViewChild('editor', { static: false }) editor!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Input() content!: FormControl;
  action = '';
  articleForm: FormGroup;
  quillEditor: Quill | undefined;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  allTags: string[]  = [];
  filteredTags!: Observable<string[]>;
  readonly tagsFormControl = new FormControl('');

  constructor(
    private activeRoute: ActivatedRoute,
    private articleService: ArticleService,
    private fb: FormBuilder,
    private fileUploadService: FileUploadService,
    private tagService: TagService,
    private Router:Router
  ) {

    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      content: [''],
      image: ['',Validators.required],
      tags: [[], minimumTagsValidator(1)]
    });


    const slug = this.activeRoute.snapshot.paramMap.get('slug');
    if(slug){
      this.action = 'Edit';
    }
    else{
      this.action = 'Create';
    }


  }

  private _filter(value: any): string[] {
    const filterValue = (typeof value === 'string' ? value : '').toLowerCase();
    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = (event.value || '').trim();

    // Thêm tag vào danh sách nếu không trùng lặp
    if (value && this.allTags.includes(value) && !this.articleForm.get('tags')!.value.includes(value)) {
      const tags = this.articleForm.get('tags')!.value as string[];
      tags.push(value);
      this.articleForm.get('tags')!.setValue(tags);
    }

    // Reset lại input sau khi thêm tag
    if (input) {
      input.value = '';
    }

    this.tagsFormControl.setValue(null);

    // Đảm bảo filteredTags cập nhật lại giá trị
    this.filteredTags = this.tagsFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );

    // Đóng mat-autocomplete nếu nó đang mở

  }

  removeTag(tag: string): void {
    const currentTags = this.articleForm.get('tags')!.value as string[];
    this.articleForm.get('tags')!.setValue(currentTags.filter(t => t !== tag));
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const tag = event.option.viewValue;

    if (!this._isTagDuplicate(tag)) {
      const currentTags = this.articleForm.get('tags')!.value as string[];
      this.articleForm.get('tags')!.setValue([...currentTags, tag]);
    }
    this.tagsFormControl.setValue(null); // Refresh FormControl value
    event.option.deselect();
  }

  private _isTagDuplicate(tag: string): boolean {
    const currentTags = this.articleForm.get('tags')!.value as string[];
    return currentTags.includes(tag);
  }

  editorStyle = {
    width: "100%",
    height: '200px'
  };

  editorModules = {
    toolbar: {

      container: [
        [{ font: [] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: 1 }, { header: 2 }],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['blockquote', 'code-block'],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'image','video'],
        ['clean']
      ],
      imageResize: true
      ,
      handlers: {
        image: () => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();

          input.onchange = () => {
            const file = input.files ? input.files[0] : null;
            if (file) {
              this.uploadImage(file).subscribe(
                (res : string) => {
                  console.log(res);
                  const range = this.quillEditor!.getSelection();
                  console.log(range);
                  this.quillEditor!.insertEmbed(range!.index, 'image', res);
                },
                (error) => {
                  console.error('Error uploading image:', error);
                }
              );
            }
          };
        }
      }
    },

  };

  onEditorChange(event:any){
    console.log(event.html);
  }
  uploadImage(file: File): Observable<string> {
    const uploadData = new FormData();
    uploadData.append('image', file, file.name);

    return this.fileUploadService.uploadFile(uploadData).pipe(
      map((result: any) => result.data),
      catchError((error) => {
        console.error('Error uploading:', error);
        throw error;
      })
    );
  }
  ngOnInit(): void {
    this.tagService.getTags().subscribe(res => {
      if (res.data) {
        this.allTags = res.data.map(t => t.name);
        this.filteredTags = this.tagsFormControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || ''))
        );
      }
    });
  }

  ngAfterViewInit(): void {
    this.quillEditor = new Quill(this.editor.nativeElement, {
      modules: this.editorModules,
      theme: 'snow',
      placeholder: 'Enter your article content here...'
    });

    // Lắng nghe sự kiện text-change của Quill
    this.quillEditor.on('text-change', () => {
      if (this.quillEditor) {
        const content = this.quillEditor.root.innerHTML;
        this.articleForm.get('content')?.setValue(content);
      }
    });
  }
  onSubmit(){
    if(this.articleForm.valid){
      console.log("Valid form");

      this.articleService.saveArticle(this.articleForm).subscribe(
        (res) => {
          let slug = res.data?.slug;
          console.log(slug);
          this.Router.navigate(['/article/',slug])
      });
    }

  }
  onFileSelected(){
    const fileInput = this.fileInput.nativeElement as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const uploadData = new FormData();
      uploadData.append('image', file, file.name);

      this.fileUploadService.uploadFile(uploadData).pipe(
        map((result: any) => {
          // Xử lý kết quả trả về từ máy chủ
          console.log('File uploaded successfully:', result);
          this.articleForm.get('image')?.setValue(result.data);
        }),
        catchError((error) => {
          console.error('Error uploading file:', error);
          throw error;
        })
      ).subscribe();
    }
  }


}


