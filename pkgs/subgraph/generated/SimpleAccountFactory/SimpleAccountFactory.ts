// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Created extends ethereum.Event {
  get params(): Created__Params {
    return new Created__Params(this);
  }
}

export class Created__Params {
  _event: Created;

  constructor(event: Created) {
    this._event = event;
  }

  get walletId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get addr(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class SimpleAccountFactory extends ethereum.SmartContract {
  static bind(address: Address): SimpleAccountFactory {
    return new SimpleAccountFactory("SimpleAccountFactory", address);
  }

  accountImplementation(): Address {
    let result = super.call(
      "accountImplementation",
      "accountImplementation():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_accountImplementation(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "accountImplementation",
      "accountImplementation():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  createAccount(owner: Address, salt: BigInt): Address {
    let result = super.call(
      "createAccount",
      "createAccount(address,uint256):(address)",
      [
        ethereum.Value.fromAddress(owner),
        ethereum.Value.fromUnsignedBigInt(salt)
      ]
    );

    return result[0].toAddress();
  }

  try_createAccount(
    owner: Address,
    salt: BigInt
  ): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "createAccount",
      "createAccount(address,uint256):(address)",
      [
        ethereum.Value.fromAddress(owner),
        ethereum.Value.fromUnsignedBigInt(salt)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  entryPoint(): Address {
    let result = super.call("entryPoint", "entryPoint():(address)", []);

    return result[0].toAddress();
  }

  try_entryPoint(): ethereum.CallResult<Address> {
    let result = super.tryCall("entryPoint", "entryPoint():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getAddress(owner: Address, salt: BigInt): Address {
    let result = super.call(
      "getAddress",
      "getAddress(address,uint256):(address)",
      [
        ethereum.Value.fromAddress(owner),
        ethereum.Value.fromUnsignedBigInt(salt)
      ]
    );

    return result[0].toAddress();
  }

  try_getAddress(owner: Address, salt: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getAddress",
      "getAddress(address,uint256):(address)",
      [
        ethereum.Value.fromAddress(owner),
        ethereum.Value.fromUnsignedBigInt(salt)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _entryPoint(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class AddStakeCall extends ethereum.Call {
  get inputs(): AddStakeCall__Inputs {
    return new AddStakeCall__Inputs(this);
  }

  get outputs(): AddStakeCall__Outputs {
    return new AddStakeCall__Outputs(this);
  }
}

export class AddStakeCall__Inputs {
  _call: AddStakeCall;

  constructor(call: AddStakeCall) {
    this._call = call;
  }

  get unstakeDelaySec(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class AddStakeCall__Outputs {
  _call: AddStakeCall;

  constructor(call: AddStakeCall) {
    this._call = call;
  }
}

export class CreateAccountCall extends ethereum.Call {
  get inputs(): CreateAccountCall__Inputs {
    return new CreateAccountCall__Inputs(this);
  }

  get outputs(): CreateAccountCall__Outputs {
    return new CreateAccountCall__Outputs(this);
  }
}

export class CreateAccountCall__Inputs {
  _call: CreateAccountCall;

  constructor(call: CreateAccountCall) {
    this._call = call;
  }

  get owner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get salt(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class CreateAccountCall__Outputs {
  _call: CreateAccountCall;

  constructor(call: CreateAccountCall) {
    this._call = call;
  }

  get ret(): Address {
    return this._call.outputValues[0].value.toAddress();
  }
}