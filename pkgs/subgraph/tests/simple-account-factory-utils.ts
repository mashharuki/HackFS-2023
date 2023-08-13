import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import { Created } from "../generated/SimpleAccountFactory/SimpleAccountFactory"

export function createCreatedEvent(walletId: BigInt, addr: Address): Created {
  let createdEvent = changetype<Created>(newMockEvent())

  createdEvent.parameters = new Array()

  createdEvent.parameters.push(
    new ethereum.EventParam(
      "walletId",
      ethereum.Value.fromUnsignedBigInt(walletId)
    )
  )
  createdEvent.parameters.push(
    new ethereum.EventParam("addr", ethereum.Value.fromAddress(addr))
  )

  return createdEvent
}
