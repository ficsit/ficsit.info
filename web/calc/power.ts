import { PoweredBuilding } from '@local/schema';

export function calcPowerConsumption(building: PoweredBuilding, clockSpeed = 1.0) {
  const { amount, exponent } = building.powerConsumption;
  return amount * Math.pow(clockSpeed, exponent);
}

export function groupPowerConsumption(building: PoweredBuilding, utilization: number) {
  const numBuildings = Math.ceil(utilization);
  const clockSpeed = utilization / numBuildings;
  const totalPower = numBuildings * calcPowerConsumption(building, clockSpeed);

  return { numBuildings, clockSpeed, totalPower };
}
