import { Client } from 'pg';

async function seedDemoUserData() {
    const client = new Client({
        statement_timeout: 3000, // opt number of milliseconds before a statement in query will time out, default is no timeout
        query_timeout: 3000, // opt number of milliseconds before a query call will timeout, default is no timeout
        application_name: 'Symptom Tracker', // opt The name of the application that created this Client instance
        connectionTimeoutMillis: 2000, // opt number of milliseconds to wait for connection, default is no timeout
        // client_encoding?: string, // specifies the character set encoding that the database uses for sending data to the client
        // options?: string // command-line options to be sent to the server
    });

    try {
        await client.connect();
    } catch (e) {
        console.error('Issue connection to client', e);
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client.on('error', (error: any) => {
        console.error('Something went wrong', error);
    })

    try {
        const { rows } = await client.query(`
            INSERT INTO users(display_name, email, timezone)
            VALUES
                ('mental_health_tracker', 'mental_health_tracker@fake-email.com', 'America/Los_Angeles'),
                ('chronic_illness_tracker', 'chronic_illness_tracker@fake-email.com', 'America/Los_Angeles')
            RETURNING id;`);
        console.log(rows);
        console.log(JSON.stringify(rows));

        const [mental_health_tracker, chronic_illness_tracker] = rows
        const result = await client.query(`
            INSERT INTO symptom(users_id, name, type, display_order)
            VALUES
                ($1, 'Over-sleeping', 'duration', 0),
                ($1, 'Food Cravings', 'severity', 1),
                ($1, 'Tired', 'severity', 2),
                ($1, 'Annoyed', 'boolean', 3),
                ($1, 'Anxious', 'boolean', 4),
                ($2, 'Sleep', 'duration', 0),
                ($2, 'Fatigue', 'severity', 1),
                ($2, 'Pain Meds Doses', 'count', 2),
                ($2, 'Dizzy', 'boolean', 3),
                ($2, 'Stomach Issues', 'boolean', 4);`,
            [mental_health_tracker.id, chronic_illness_tracker.id]);
        console.log(result);
        console.log(JSON.stringify(result));
    } catch (e) {
        console.error('Failed to insert users/symptoms into table', e);
    }

    try {
        await client.end();
    } catch (e) {
        console.error('Issue ending client connection', e);
    }
}

// seedDemoUserData();