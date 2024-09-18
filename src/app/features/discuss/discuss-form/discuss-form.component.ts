import { Component,ViewChild,ElementRef,Input } from '@angular/core';
import { FormControl,FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { Observable,map,catchError } from 'rxjs';
import Quill from 'quill';
@Component({
  selector: 'app-discuss-form',
  templateUrl: './discuss-form.component.html',
  styleUrl: './discuss-form.component.css'
})
export class DiscussFormComponent {
  @ViewChild('editor', { static: false }) editor!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Input() content!: FormControl
  action = '';
  discussForm: FormGroup;
  quillEditor: Quill | undefined;

  constructor(
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,

    private fileUploadService: FileUploadService
  ) {

    this.discussForm = this.fb.group({
      title: ['', Validators.required],
      content: [''],
    });

    const slug = this.activeRoute.snapshot.paramMap.get('slug');
    if(slug){
      this.action = 'Edit';
    }
    else{
      this.action = 'Create';
    }
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
        this.discussForm.get('content')?.setValue(content);
      }
    });
  }
  onSubmit(){
    if(this.discussForm.valid){

    }
    console.log(this.discussForm.value);
  }

}
