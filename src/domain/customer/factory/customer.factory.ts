import Customer from "../entity/customer";
import { v4 as uuid } from "uuid";
import Address from "../value-object/address";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "../event/customer-created.event";
import CustomerAddressChangedEvent from "../event/customer-address-changed.event";

export default class CustomerFactory {

  private _eventDispatcher: EventDispatcher;

  constructor(eventDispatcher: EventDispatcher){
    this._eventDispatcher = eventDispatcher;
  }
  
  public create(name: string): Customer {
    const customer = new Customer(uuid(), name);
    this._eventDispatcher.notify(new CustomerCreatedEvent(customer))
    return customer
  }

  public createWithAddress(name: string, address: Address): Customer {
    const customer = new Customer(uuid(), name);
    customer.changeAddress(address);
    this._eventDispatcher.notify(new CustomerAddressChangedEvent(customer))
    return customer;
  }
}
