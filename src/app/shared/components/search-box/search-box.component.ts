import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: [
  ]
})
export class SearchBoxComponent implements OnInit, OnDestroy {

  dbouncer = new Subject<string> //1
  dbouncerSuscription?: Subscription;

  @Input()
  public placeholder: string = '';

  @Input()
  public initialValue: string = '';

  @Output()
  public onValue = new EventEmitter<string>();

  @Output()
  onDebounce = new EventEmitter<string>();

  ngOnInit(): void {
    this.dbouncerSuscription = this.dbouncer.pipe(debounceTime(500)).subscribe(value => { //3
      this.onDebounce.emit(value);
    })
  }

  ngOnDestroy(): void {
    this.dbouncerSuscription?.unsubscribe();
  }

  emitValue( value: string ):void {
    this.onDebounce.emit( value );
  }

  onKeyPress(searchTerm: string){
    this.dbouncer.next(searchTerm) //2
  }


}

// 1-> Es un tipo especial de Observable. Crea un observable manualmente
// 2-> next() se usa para enviar un valor o notificación a un observable suscrito a Subject
// debounceTime() -> Cuanto tiempo espera para hacer la siguiente emisión. 
// El observable this.debouncer emite un valor, llega el pipe, tiene un debouncerTime de espera de 1 segundo
// para saber si recibe valores, hasta que el usuario deja de escribir, es decir, hasta que this.debouncer 
// deja de emitir valores durante 1 segundo, entra el subscribe en juego
// 3-> Al salir destruirás dbouncerSuscription y se dejarán de recibir valores. 
// Creas una suscripción, tienes que limpiar la suscripción