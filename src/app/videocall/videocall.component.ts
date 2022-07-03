import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as OT from '@opentok/client';
@Component({
  selector: 'app-videocall',
  templateUrl: './videocall.component.html',
  styleUrls: ['./videocall.component.css']
})
export class VideocallComponent implements OnInit,AfterViewInit {
  title = 'jaaliVdo';
  apiKey = "47528371";
  sessionId = "1_MX40NzUyODM3MX5-MTY1NjA1Njk0ODkxN35zQnkxejQ4bnNpZ0JXM0hpdXJCZFNRa3N-fg";
  token = "T1==cGFydG5lcl9pZD00NzUyODM3MSZzaWc9YmMxM2I3ODdjODhlNzdmY2Q0NDgzNzQ4ODcwYmY4ZTdmZGI4MzY0NDpzZXNzaW9uX2lkPTFfTVg0ME56VXlPRE0zTVg1LU1UWTFOakExTmprME9Ea3hOMzV6UW5reGVqUTRibk5wWjBKWE0waHBkWEpDWkZOUmEzTi1mZyZjcmVhdGVfdGltZT0xNjU2MDU3MTU3Jm5vbmNlPTAuNTgxMTkyOTk0Mzg3NDI4OCZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjU4NjQ5MTU1JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";
  streams: Array<OT.Stream> = [];
  session=OT.initSession(this.apiKey, this.sessionId);
  share=false
  @ViewChild('publisherDiv') publisherDiv!: ElementRef;
  @ViewChild('subscriberDiv') subscriberDiv!: ElementRef;
  constructor(){
    
  }
  ngAfterViewInit(): void {
    this.initializeSession()
  }
  ngOnInit(): void {
    this.checkForCamera()
    this.session.on('streamDestroyed', (event) => {
      alert('bye bye');
      
    });
    this.session.on('mediaStopped', (event) => {
      alert('bye bye');
      
    });
    this.session.on('sessionDisconnected',(event)=>{
      alert('sessionDisconnected')
    })
    this.session.on('streamPropertyChanged',(event)=>{
      alert('streamPropertyChanged')
    })
  }
  checkForCamera() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    
    })
    .catch(function(err) {
      //For no camera Found
    });
  }

  handleError(error:any) {
    if (error) {
      alert(error.message);
    }
  }
  
  initializeSession() {

    this.session.on('streamCreated', (event) => {
      this.streams.push(event.stream);
      console.log(this.streams,event);
      
      // changeDetectorRef.detectChanges();
    });
    this.session.on('streamDestroyed', (event) => {
      alert('ypppp,event.stream')
      const idx = this.streams.indexOf(event.stream);
      if (idx > -1) {
        this.streams.splice(idx, 1);
        // this.changeDetectorRef.detectChanges();
      }
    });
  
    // Subscribe to a newly created stream
  
    // Create a publisher
    const poptions:any = {
      insertMode: 'replace',
      width: '640px',
        height: '480px'
    }
   
    
    var publisher = OT.initPublisher(this.publisherDiv.nativeElement, poptions, this.handleError);

    
    // Connect to the session
    this.session.connect(this.token, (error) => {
      // If the connection is successful, publish to the session
      if (error) {
        this.handleError(error);
      } else {
        this.session.publish(publisher, this.handleError);
      }
    });

    this.session.on('streamCreated', (event)=> {
      this.session.subscribe(event.stream, this.subscriberDiv.nativeElement, {
        insertMode: 'replace',
        width: '640px',
        height: '480px'
      }, this.handleError);
    });
    
  }

  onShare(){
    this.share = !this.share
    if(this.share){
      const poptions:any = {
      videoSource:'screen',
      insertMode: 'replace',
      width: '640px',
        height: '480px'
    }
   
    console.log(OT.getUserMedia());
    
    var publisher = OT.initPublisher(this.publisherDiv.nativeElement, poptions, this.handleError);
    this.session.publish(publisher, this.handleError);
    }
    else{
      const poptions:any = {
        insertMode: 'replace',
        width: '640px',
        height: '480px'
      }
     
      
      var publisher = OT.initPublisher(this.publisherDiv.nativeElement, poptions, this.handleError);
      this.session.publish(publisher, this.handleError)
      this.onSessionDestroyed(publisher)
    }
    
  }
  onSessionDestroyed(publisher: OT.Publisher) {
    publisher.on("destroyed",()=>{
      alert('gfuyguyugyi')
    })
  }

  

}


