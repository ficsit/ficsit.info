import { declareReference } from './reference';

describe(`schema.declare.reference`, () => {
  describe(`declareReference`, () => {
    const schema = declareReference();

    it(`parses Class references`, () => {
      const reference = schema.parse(`Class'/Script/FactoryGame.FGConsumableEquipment'`)!;
      expect(reference.kind).toEqual('Class');
      expect(reference.path).toEqual('/Script/FactoryGame.FGConsumableEquipment');
    });

    it(`parses nested references`, () => {
      const reference = schema.parse(
        `ParticleSystem'"/Game/FactoryGame/Buildable/Factory/MinerMk2/Particle/MiningCoal.MiningCoal"'`,
      )!;
      expect(reference.kind).toEqual('ParticleSystem');
      expect(reference.path).toEqual(
        '/Game/FactoryGame/Buildable/Factory/MinerMk2/Particle/MiningCoal.MiningCoal',
      );
    });

    it(`parses bare paths`, () => {
      const reference = schema.parse(
        `/Game/FactoryGame/Buildable/Factory/AssemblerMk1/Build_AssemblerMk1.Build_AssemblerMk1_C`,
      )!;
      expect(reference.kind).toEqual(undefined);
      expect(reference.path).toEqual(
        '/Game/FactoryGame/Buildable/Factory/AssemblerMk1/Build_AssemblerMk1.Build_AssemblerMk1_C',
      );
    });

    it(`throws for unknown formats`, () => {
      expect(() => {
        schema.parse(`FactoryGame.FGConsumableEquipment`);
      }).toThrowError(/FactoryGame\.FGConsumableEquipment/);
    });

    it(`throws for values of the wrong type`, () => {
      expect(() => {
        schema.parse(1);
      }).toThrowError(/1/);
    });

    it(`throws for undefined`, () => {
      expect(() => {
        schema.parse(undefined);
      }).toThrowError(/undefined/);
    });
  });
});
