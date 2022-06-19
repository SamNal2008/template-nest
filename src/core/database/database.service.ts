import { ForbiddenException, Injectable } from '@nestjs/common';
import { EntityTarget, getConnection } from 'typeorm';
import { FixtureGenerator, IColumnType } from './fixture';
import { ConfigService } from '@nestjs/config';
import { ENodeEnv } from '../utils/interfaces/configuration.interface';
import { MimeTypeEnum } from '../file/utils/enums/mime-types.enum';

interface DatabaseDependencies {
  [key: string]: string[];
}

interface FixtureGenerated {
  [key: string]: unknown[];
}

interface DataInfo {
  dependencies: DatabaseDependencies;
  entities: string[];
}

@Injectable()
export class DatabaseService {
  private _dataInfos: DataInfo = {
    dependencies: {},
    entities: [],
  };

  private _fixturesGenerated: FixtureGenerated = {};

  constructor(private readonly configService: ConfigService) {}

  public static getColumnAndType(
    entityTarget: EntityTarget<unknown>,
  ): IColumnType[] {
    return getConnection()
      .getMetadata(entityTarget)
      .ownColumns.map((column) => ({
        name: column.propertyName,
        type: column.type.toString(),
      }));
  }

  public static getEntities(): string[] {
    return getConnection().entityMetadatas.map((entity) => entity.name);
  }

  public static buildDependenciesGraph(): DatabaseDependencies {
    const dependencies: DatabaseDependencies = {};
    for (const entity of getConnection().entityMetadatas) {
      dependencies[entity.name] = [];
      entity.relations.forEach((relation) => {
        if (
          (relation.isOneToOne && relation.isOneToOneOwner) ||
          (relation.isManyToMany && relation.isManyToManyOwner)
        ) {
          typeof relation.type !== 'string'
            ? dependencies[entity.name].push(relation.type.name)
            : '';
        }
      });
    }
    return dependencies;
  }

  async dropDatabase(): Promise<void> {
    if (this.configService.get('app.node_env') === ENodeEnv.PROD) {
      throw new ForbiddenException('Cannot drop database in production');
    }
    const dropBeforeSync = true;
    await getConnection().synchronize(dropBeforeSync);
  }

  async fillDatabase(): Promise<void> {
    this._dataInfos.dependencies = DatabaseService.buildDependenciesGraph();
    this._dataInfos.entities = DatabaseService.getEntities();
    this._dataInfos.entities.forEach((entity) => {
      this._fixturesGenerated[entity] = [];
    });

    const createStack = (dataInfo: DataInfo): string[] => {
      const sortedEntities = [];
      const { dependencies, entities } = dataInfo;
      const hasElementInGraph = (): boolean =>
        !entities.every((entity) => sortedEntities.includes(entity));
      while (hasElementInGraph()) {
        for (const entity in dependencies) {
          if (sortedEntities.includes(entity)) continue;
          if (
            !dependencies[entity].length ||
            dependencies[entity].every((dependency) =>
              sortedEntities.includes(dependency),
            )
          ) {
            sortedEntities.push(entity);
          }
        }
      }
      return sortedEntities;
    };

    const entitiesToCreateInOrder = createStack(this._dataInfos);
    console.table(entitiesToCreateInOrder);

    for (const entity of entitiesToCreateInOrder) {
      const fixtureGenForEntity = FixtureGenerator.for(entity);
      fixtureGenForEntity.generateTables(1, {
        mimeType: MimeTypeEnum.PNG,
        theme: 'Dark',
      });
      for (const entityFixture of fixtureGenForEntity.entitiesFixtures) {
        const newFixture = getConnection().manager.create(
          entity,
          entityFixture,
        );
        this._fixturesGenerated[entity].push(entityFixture);
        if (this._dataInfos.dependencies[entity].length) {
          for (const dependency of this._dataInfos.dependencies[entity]) {
            newFixture[dependency.toLowerCase()] = this._fixturesGenerated[
              dependency
            ].find((elt) => elt)['id'];
            console.log(newFixture);
            console.log(dependency);
            console.log(newFixture[dependency]);
          }
        }
        await getConnection().manager.save(newFixture);
      }
      console.log(entity + this._fixturesGenerated[entity]);
    }

    // When dependencies have been resolved => Load some test data
    /** public onModuleInit(): void {
    return;
  } */
  }
}
