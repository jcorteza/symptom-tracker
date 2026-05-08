import { MigrationBuilder, PgLiteral } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder) => {
    pgm.createTable('users', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: PgLiteral.create('gen_random_uuid()')
        },
        username: {
            type: 'varchar(20)',
            notNull: true,
            unique: true
        },
        password: {
            type: 'varchar(60)',
            notNull: true
        },
        'display_name': 'varchar(30)',
        timezone: {
            type: 'varchar(32)',
            notNull: true
        },
        tags: {
            type: 'varchar(30)[]',
            default: pgm.func('\'{}\'::varchar(30)[]')
        }
    }, {
        ifNotExists: true
    });
    pgm.createTable('symptom', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: PgLiteral.create('gen_random_uuid()')
        },
        'users_id': {
            type: 'uuid',
            references: 'users',
            onDelete: 'CASCADE',
            notNull: true
        },
        name: {
            type: 'varchar(50)',
            notNull: true
        },
        type: {
            type: 'varchar(8)',
            notNull: true,
            check: 'type IN (\'boolean\',\'count\',\'duration\',\'severity\')' 
        },
        'max_value': 'smallint',
        thresholds: 'jsonb',
        'time_unit': {
            type: 'varchar(7)',
            check: 'time_unit IN (\'minutes\',\'hours\')'
        },
        'display_order': {
            type: 'smallint',
            notNull: true
        },
        status: {
            type: 'varchar(8)',
            notNull: true,
            default: 'active',
            check: 'status IN (\'active\',\'archived\')'
        }
    }, { ifNotExists: true });
    pgm.createTable('symptom_entry', {
        'local_date': {
            type: 'date',
            notNull: true
        },
        ts: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('current_timestamp')
        },
        'symptom_id': {
            type: 'uuid',
            references: 'symptom',
            onDelete: 'CASCADE',
            notNull: true
        },
        value: {
            type: 'smallint',
            notNull: true
        },
    }, { ifNotExists: true });
    pgm.createTable('notes_entry', {
        'local_date': {
            type: 'date',
            notNull: true
        },
        ts: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('current_timestamp')
        },
        'users_id': {
            type: 'uuid',
            references: 'users',
            onDelete: 'CASCADE',
            notNull: true
        },
        notes: 'text',
        tags: {
            type: 'varchar(30)[] ',
            default: pgm.func('\'{}\'::varchar(30)[]')
        }
    }, { ifNotExists: true });
    pgm.createIndex('symptom', 'users_id');
    pgm.addConstraint('symptom_entry', null, { primaryKey: ['symptom_id','local_date'] })
    pgm.addConstraint('notes_entry', null, { primaryKey: ['users_id', 'local_date'] })
};

export async function down(pgm: MigrationBuilder): Promise<void> { }
// node-pg-migrate up --dry-run