import { DatabaseService } from './database.service';
import { EntityTarget } from 'typeorm';
import { RandomGeneratorFactory } from '../utils/functions/random-generator-factory';

export interface IColumnType {
  name: string;
  type: string;
}

export class FixtureGenerator<T> {
  private _propertiesTypeMappingTable: IColumnType[];

  private _entitiesFixtures: T[];

  public get entitiesFixtures(): T[] {
    return this._entitiesFixtures;
  }

  public set entitiesFixtures(value: T[]) {
    this._entitiesFixtures = value;
  }

  public static for<V>(entity: EntityTarget<V>): FixtureGenerator<V> {
    const newFixture = new FixtureGenerator<V>();
    newFixture._propertiesTypeMappingTable =
      DatabaseService.getColumnAndType(entity);
    return newFixture;
  }

  public generateFixture(withProperties?: Partial<T>): T {
    const newFixture = {} as T;
    for (const property of this._propertiesTypeMappingTable) {
      newFixture[property.name] = withProperties?.hasOwnProperty(property.name)
        ? withProperties[property.name]
        : RandomGeneratorFactory.generate(property.type, property.name);
    }
    return newFixture;
  }

  public generateTables(tableSize = 1, withProperties?: Partial<T>): T[] {
    const fixturesTable = [];
    for (let i = 0; i < tableSize; i++)
      fixturesTable.push(this.generateFixture(withProperties));
    this.entitiesFixtures = fixturesTable;
    return fixturesTable;
  }
}
