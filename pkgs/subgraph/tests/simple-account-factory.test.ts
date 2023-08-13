import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { Created } from "../generated/schema"
import { Created as CreatedEvent } from "../generated/SimpleAccountFactory/SimpleAccountFactory"
import { handleCreated } from "../src/simple-account-factory"
import { createCreatedEvent } from "./simple-account-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let walletId = BigInt.fromI32(234)
    let addr = Address.fromString("0x0000000000000000000000000000000000000001")
    let newCreatedEvent = createCreatedEvent(walletId, addr)
    handleCreated(newCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Created created and stored", () => {
    assert.entityCount("Created", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Created",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "walletId",
      "234"
    )
    assert.fieldEquals(
      "Created",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "addr",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
