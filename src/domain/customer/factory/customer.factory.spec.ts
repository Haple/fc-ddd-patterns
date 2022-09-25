import CustomerFactory from "./customer.factory";
import Address from "../value-object/address";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import SendLog1WhenCustomerIsCreatedHandler from "../event/handler/send-log1-when-customer-is-created.handler";
import SendLog2WhenCustomerIsCreatedHandler from "../event/handler/send-log2-when-customer-is-created.handler";
import SendLogWhenCustomerAddressChangedHandler from "../event/handler/send-log-when-customer-address-changed.handler";

describe("Customer factory unit test", () => {
  it("should create a customer", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new SendLog1WhenCustomerIsCreatedHandler();
    const eventHandler2 = new SendLog2WhenCustomerIsCreatedHandler();
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");
    const spyEventDispatcherNotify = jest.spyOn(eventDispatcher, "notify");
    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    const customerFactory = new CustomerFactory(eventDispatcher);
    let customer = customerFactory.create("John");

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.Address).toBeUndefined();
    expect(spyEventDispatcherNotify).toHaveBeenCalled();
    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });

  it("should create a customer with an address", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendLogWhenCustomerAddressChangedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    const spyEventDispatcherNotify = jest.spyOn(eventDispatcher, "notify");
    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);
    const customerFactory = new CustomerFactory(eventDispatcher);

    const address = new Address("Street", 1, "13330-250", "São Paulo");
    let customer = customerFactory.createWithAddress("John", address);

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.Address).toBe(address);
    expect(spyEventDispatcherNotify).toHaveBeenCalled();
    expect(spyEventHandler).toHaveBeenCalled();
  });
});
