import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentsService } from '../../shared/services/comments.service';
import { PostService } from '../../shared/services/post.service';
import { map, forkJoin, switchMap, tap, of } from 'rxjs';
import { ReactionsService } from 'src/app/shared/services/reactions.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Comment } from '../../shared/classes/Comment'
import { CommentCustom } from 'src/app/shared/classes/CommentCustom';
import { Post2Custom } from '../../shared/classes/Post2Custom'

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  public postid :string = '';
  public post :Post2Custom;
  public inputComment :string = ''
  public comments :CommentCustom[] = []
  public cursorChange :boolean = true;
  public timer :any;

  public counter :number = 0;
  public iteration :number = 6
  public running :boolean = false;

  public limit :number;

  public userAccessToken :string = ''

  public userReactions :{[key:string] :boolean} = {}

  @ViewChild('heartgenerator') div? :ElementRef;
  @ViewChild('heartsvg') heartsvg? :ElementRef;
  @ViewChild('postImage') image :any;
  @ViewChild('cursor') cursor :any;
  @ViewChildren('heartcursortrailer') queryElement? :QueryList<ElementRef>

  constructor(private postService :PostService, private route :ActivatedRoute, private commentService :CommentsService, private reactionService :ReactionsService, private render :Renderer2, private router :Router, private authService :AuthService) {
    this.limit = 5;
    this.post = new Post2Custom();
  }

  ngOnInit(): void {
    this.authService.refreshedIDToken().then( token => {
      if(token !== undefined){
        this.userAccessToken = token
        this.route.params.pipe(
          tap(postid => this.postid = postid['id']),
          switchMap(postid => {
            const params = {userAccessToken: this.userAccessToken}
            return this.postService.getPost(postid['id'], params)
          })
        ).subscribe( post => {
          let element = new Post2Custom();
          if(element.parse_full_object(post)){
            this.post = element;
          }
          else{
            console.error('Invalid parse Post2Custom in ngOnInit')
          }
          this.matchReactions()
        })
        this.loadMoreComments()
      }
      else{
        console.error('Missing userAccessToken')
        this.router.navigate(['welcome'])
      }
    })
  }

  clickReaction(emojiURI :string){
    this.reactionService.reactEmoji({ reactionsID: emojiURI, postID: this.postid }).pipe(
      switchMap( result => {
        const params = { userAccessToken: this.userAccessToken }
        return this.postService.getPost(this.postid, params)
      })
    ).subscribe((post) => {
      this.post = post
      this.matchReactions()
    })
  }

  mouseDown(event :MouseEvent){
    if(this.queryElement !== undefined){
      const elements = this.queryElement.toArray()
      let i = 0;
      while(i < 6){
        elements[i].nativeElement.style.display = 'inline'
        elements[i].nativeElement.style.left = event.clientX.toString() + 'px'
        elements[i].nativeElement.style.top = event.clientY.toString() + 'px'
        i = i + 1
      }
    }
  }

  mouseUp(){
    if(this.queryElement !== undefined){
      let elements = this.queryElement.toArray()

      let i = 0;
      while(i < 6){
        elements[i].nativeElement.style.display = 'none'
        i = i + 1
      }
    }
  }

  mousemove2(event :MouseEvent){
    if(this.heartsvg !== undefined){
      let svg :ElementRef = this.heartsvg

      if(this.div !== undefined){
        this.render.appendChild(this.div.nativeElement, svg.nativeElement)
      }
    }
  }

  mouseover(event :MouseEvent){
    if(this.queryElement !== undefined){
      if(!this.running){
        this.running = true;

        setTimeout(() => {
          let i = this.counter % this.iteration
          if(this.queryElement !== undefined){
            let elements = this.queryElement?.toArray()
            elements[i].nativeElement.style.left = event.clientX.toString() + "px"
            elements[i].nativeElement.style.top = event.clientY.toString() + "px"
            this.counter = this.counter + 1;
          }
          this.running = false;
        }, 80)
      }
    }
    else{
      console.log('wrong')
    }
    clearTimeout(this.timer)

    this.timer = setTimeout(()=>{
      let i = 0;
      if(this.queryElement !== undefined){
      let elements = this.queryElement.toArray()
      while(i < 6){
        elements[i].nativeElement.style['animation-name'] = 'floatUp'
        i = i + 1
      }
      }
    }, 500)
  }

  moveMyName($event :any){
    const mouseX = $event.clientX
    const mouseY = $event.clientY
    console.log($event.clientX, $event.clientY,this.cursor)
    this.cursor.nativeElement.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
  }

  loadMoreComments(){
    let params = {offset: this.comments.length , limit: this.limit}
    this.commentService.getLimitedComments(this.postid, params).subscribe((comments) => {
      comments.forEach((comment :any) => {
        let element = new CommentCustom()
        if(element.parse_full_object(comment)){
          this.comments.push(element)
        }
      })
    })
  }

  submitComment(){
    this.commentService.addComments({ postID: this.postid, comment: this.inputComment }).pipe(
      switchMap( result => {
        if(this.comments.length !== 0 || this.comments.length % this.limit !== 0){
          let params = { offset: this.comments.length, limit: this.limit }
          this.commentService.getLimitedComments(this.postid, params).pipe(
            map(comments => {
              this.comments = [...this.comments, ...comments]
            })
          )
          return of(this.comments)
        }
        else{
          return of(result)
        }
      })
    ).subscribe()
    this.inputComment = ''
  }

  matchReactions(){
    let userTokenString = localStorage.getItem('user')
    let userToken = JSON.parse(userTokenString!)
    let userid;

    if(userToken !== null && userToken.uid !== null){
      userid = userToken.uid
    }
    else{
      throw Error('There is no user token')
    }

    const reactionsArr = this.post.reactions
    const reactionsRecord = this.post.post.reactions

    for(let reaction of reactionsArr){
      this.userReactions[reaction.uid] = false;
      let matchingObject = { "reactionID": reaction.uid, "userID": userid }
      if(reactionsRecord.find((reaction :any) => reaction.reactionID === matchingObject.reactionID && reaction.userID === matchingObject.userID)){
        this.userReactions[reaction.uid] = true
      }
    }
  }

  debug(){
    this.matchReactions()
  }

  returnChallenge(){
    this.router.navigate([`challenge/${this.post.post.challengeID}`])
  }
}
