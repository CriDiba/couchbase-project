
### Q1

Dato un utente (id) ed un periodo di tempo (inizio-fine), fornire la lista delle visioni effettuate fatte durante quel periodo.

```sql
SELECT V
FROM `auditel-bucket`._default.`user-record-collection` AS U
UNNEST U.viewings V
WHERE U.id = '11'
    AND V.startTime >= '2003-02-10 00:00:00'
    AND V.endTime <= "2003-12-10 23:00:00"
```

### Q2

Dato un periodo di tempo (inizio-fine), trovare il programma più visto in termini di secondi riportando il nome del programma ed il canale.

```sql
SELECT  V.programId, SUM(DATE_DIFF_STR(V.endTime, V.startTime, 'second')) AS durata
FROM `auditel-bucket`._default.`user-record-collection` AS U
UNNEST U.viewings V
WHERE V.startTime >= '2003-02-10 00:00:00'
    AND V.endTime <= "2003-12-10 23:00:00"
GROUP BY V.programId

```

### Q3

Dato un programma, trovare il gruppo di utenti più numeroso che ha visionato quello specifico programma.

```sql
SELECT  V.programId, U.groupId, COUNT(U.id)
FROM `auditel-bucket`._default.`user-record-collection` AS U UNNEST U.viewings V
WHERE V.programId = '10'
GROUP BY V.programId, U.groupId
```
