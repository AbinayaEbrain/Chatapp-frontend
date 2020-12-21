import { Component, OnInit, AfterViewInit, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { TokenService } from '../../services/token.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import io from 'socket.io-client';
import { CaretEvent, EmojiEvent, EmojiPickerOptions } from 'ng2-emoji-picker';
import _ from 'lodash';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewInit, OnChanges {
  // Input decorator allows data to be sent from parent to child cmpnt
  // In this case, message cmpnt is the child for chats cmpnt
  @Input() users;
  isOnline = false;
  receiverName: String;
  user: any;
  message: any;
  receiverData: any;
  messagesArray = [];
  socket: any;
  typingMessage;
  typing = false;

  // Emoji
  public eventMock;
  public eventPosMock;

  public direction =
    Math.random() > 0.5 ? (Math.random() > 0.5 ? 'top' : 'bottom') : Math.random() > 0.5 ? 'right' : 'left';
  public toggled = false;
  public content = ' ';

  private _lastCaretEvent: CaretEvent;

  constructor(
    private messageService: MessageService,
    private TokenService: TokenService,
    private routes: ActivatedRoute,
    private userService: UsersService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.TokenService.getPayload();
    this.routes.params.subscribe(params => {
      this.receiverName = params.name;
      this.getUserByName(this.receiverName);
    });

    this.socket.on('refreshPage', data => {
      this.getUserByName(this.receiverName);
    });

    this.socket.on('is_typing', data => {
      if (data.sender === this.receiverName) {
        this.typing = true;
      }
    });

    this.socket.on('stopped_typing', data => {
      if (data.sender === this.receiverName) {
        this.typing = false;
      }
    });
  }

  // To detect the changes in this component..
  // In other words, to get the data for @Input automatically
  // ngOnChanges(){console.log(this.users)} => other way to get changed values
  ngOnChanges(changes: SimpleChanges) {
    const title = document.querySelector('.nameCol'); // To style the 'nameCol' class

    if (changes.users.currentValue.length > 0) {
      // Use indexOf() in the  'currentValue' array that checks for the receiverName in that array
      // If there is data, it returns value greater than -1 or simply -1.
      const result = _.indexOf(changes.users.currentValue, this.receiverName);
      if (result > -1) {
        this.isOnline = true;
        (title as HTMLElement).style.marginTop = '10px'; // Styling the title variable which has class 'nameCol'
      } else {
        this.isOnline = false;
        (title as HTMLElement).style.marginTop = '10px';
      }
    }
  }

  ngAfterViewInit() {
    // To emit the 'join chat' event
    const params = {
      room1: this.user.username,
      romm2: this.receiverName
    };

    this.socket.emit('join chat', params);
  }

  getUserByName(name) {
    this.userService.getUserByName(name).subscribe(data => {
      this.receiverData = data.result;
      this.getAllMessages(this.user._id, data.result._id);
    });
  }

  sendMessage() {
    if (this.message) {
      this.messageService
        .sendMessage(this.user._id, this.receiverData._id, this.receiverData.username, this.message)
        .subscribe(data => {
          this.socket.emit('refresh', {});
          this.message = '';
        });
    }
  }

  getAllMessages(senderId, receiverId) {
    this.messageService.getAllMessages(senderId, receiverId).subscribe(
      data => {
        this.messagesArray = data.messages.message;
      },
      err => {
        console.log(err);
      }
    );
  }

  isTyping() {
    // When user is typing,it emits the event and it will be called in 'private.js'
    this.socket.emit('starts_typing', {
      sender: this.user.username,
      receiver: this.receiverName
    });

    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }

    this.typingMessage = setTimeout(() => {
      this.socket.emit('stop_typing', {
        sender: this.user.username,
        receiver: this.receiverName
      });
    }, 500);
  }

  // Emoji
  handleSelection(event: EmojiEvent) {
    this.content =
      this.content.slice(0, this._lastCaretEvent.caretOffset) +
      event.char +
      this.content.slice(this._lastCaretEvent.caretOffset);
    this.eventMock = JSON.stringify(event);
    this.message = this.content; // Set emoji to message varaible

    this.toggled = !this.toggled;
    this.content = '';
  }

  handleCurrentCaret(event: CaretEvent) {
    this._lastCaretEvent = event;
    this.eventPosMock = `{ caretOffset : ${event.caretOffset}, caretRange: Range{...}, textContent: ${
      event.textContent
    } }`;
  }

  toggledEmoji() {
    this.toggled = !this.toggled;
  }
}
