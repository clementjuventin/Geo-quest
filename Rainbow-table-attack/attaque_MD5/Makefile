CC=gcc
CFLAGS=
LDFLAGS=
LDLIBS = -lcrypto
EXEC=rainbow_create rainbow_attack hash_many
ARGS_RAINBOW_ATTACK=./attack/r_tables/r1.txt ./attack/r_tables/r2.txt ./attack/r_tables/r3.txt ./attack/r_tables/r4.txt ./attack/r_tables/r5.txt ./attack/r_tables/r6.txt ./attack/r_tables/r7.txt ./attack/r_tables/r8.txt ./attack/r_tables/r9.txt ./attack/r_tables/r10.txt ./crackme2021.txt ./found.txt
ARGS_RAINBOW_CREATE=./attack/r_tables/r1.txt ./attack/r_tables/r2.txt ./attack/r_tables/r3.txt ./attack/r_tables/r4.txt ./attack/r_tables/r5.txt ./attack/r_tables/r6.txt ./attack/r_tables/r7.txt ./attack/r_tables/r8.txt ./attack/r_tables/r9.txt ./attack/r_tables/r10.txt
ARGS_HASH_MANY=./hash_many/target.txt ./hash_many/output.txt

all: $(EXEC)

rainbow_create: generation/generate_tables.c generation/hashtable.c
	$(CC) $^ -o rainbow_create $(CFLAGS) $(LDLIBS)
	./rainbow_create $(ARGS_RAINBOW_CREATE)

rainbow_attack: attack/attack.c attack/hash_table_attack.c
	$(CC) $^ -o rainbow_attack $(CFLAGS) $(LDLIBS) && ./rainbow_attack $(ARGS_RAINBOW_ATTACK)

hash_many: hash_many/hash_many.c
	$(CC) $^ -o hash_many.o $(CFLAGS) $(LDLIBS) && ./hash_many.o $(ARGS_HASH_MANY) 

clean:
	rm -f *.o core
mrproper: clean
	rm -f $(EXEC)