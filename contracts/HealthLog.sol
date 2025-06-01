// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthLog {
    struct Event {
        string patientId;
        string eventType;
        uint256 timestamp;
    }

    Event[] public events;

    function logEvent(string memory patientId, string memory eventType) public {
        events.push(Event(patientId, eventType, block.timestamp));
    }

    function getEventCount() public view returns (uint) {
        return events.length;
    }

    function getEvent(uint index) public view returns (string memory, string memory, uint256) {
        Event memory e = events[index];
        return (e.patientId, e.eventType, e.timestamp);
    }
}
