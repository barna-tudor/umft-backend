const hre = require("hardhat");

async function main() {
    const HealthLog = await hre.ethers.getContractFactory("HealthLog");
    const contract = await HealthLog.deploy();
    await contract.waitForDeployment();

    console.log("✅ HealthLog deployed to:", contract.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
