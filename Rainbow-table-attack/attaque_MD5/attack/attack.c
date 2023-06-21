#include "./attack.h"
 //gcc ./attack/attack.c ./attack/hash_table_attack.c -o attack.o -lcrypto
//./attack.o ./attack/r_tables/r1.txt ./attack/r_tables/r2.txt ./attack/r_tables/r3.txt ./attack/r_tables/r4.txt ./attack/r_tables/r5.txt ./attack/r_tables/r6.txt ./attack/r_tables/r7.txt ./attack/r_tables/r8.txt ./attack/r_tables/r9.txt ./attack/r_tables/r10.txt ./crackme2021.txt ./solution.txt
#define M 6
#define L 1000
#define R 10
#define N 100000
#define set_size powl(26, M)

//Lit une ligne de notre fichier (ex: aabcab qoisqz | pass0 passL)
Line * read_line(char * ligne) {
  Line * line = (Line * ) malloc(sizeof(Line));
  line -> pass0 = (char * ) malloc(sizeof(char) * (M + 1));
  line -> passL = (char * ) malloc(sizeof(char) * (M + 1));

  if (line == NULL) {
    printf("Error generate_r_table malloc");
    exit(1);
  }

  char * strokedString;
  const char * separators = " ";
  int i = 0;

  strokedString = strtok(ligne, separators);
  while (strokedString != NULL) {
    if (i == 0) strcpy(line -> pass0, strokedString);
    if (i == 1) {
      strokedString[M] = '\0';
      strcpy(line -> passL, strokedString);
    }
    strokedString = strtok(NULL, separators);
    i++;
  }
  return line;
}

//Génère la r_table à partir de son nom
Node ** generate_hash_table_from_r_table(char * r_table_name, int HASH_TABLE_SIZE) {
  Node ** hash_table = init_hash_table(hash_table, HASH_TABLE_SIZE);

  FILE * file;
  file = fopen(r_table_name, "r");
  if (file == NULL) {
    perror("Error while opening the file.\n");
    exit(1);
  }

  char * ligne = NULL;
  size_t len = 0;
  ssize_t read;
  char * pass;
  Line * line;

  while ((read = getline( & ligne, & len, file)) != -1) {
    ligne[16] = '\0'; //Pourquoi 16?
    line = read_line(ligne);
    //printf("pass0: %s\tpassL : %s\n", line->pass0, line->passL);
    insert_pass(hash_table, HASH_TABLE_SIZE, line -> pass0, line -> passL);
    //printf("Line inserted pass0 %s", line->pass0);
  }
  fclose(file);
  return hash_table;
}

//On teste un antécédent pour un hash donné, return NULL si il n'y a pas match, pass sinon
char * get_pass(char * candidat, int index, pwhash hash_) {
  char * pass = (char * ) malloc(sizeof(char * ) * (M + 1));
  if (pass == NULL) {
    printf("Error get_pass malloc");
    exit(1);
  }
  strcpy(pass, candidat);

  //printf("%s -> ", candidat);
  //pwhash hash_i;

  pwhash hash = target_hash_function(pass); //i
  for (int k = 0; k <= index; k++) {
    if (hash == hash_) return pass;
    reduction(pass, hash, k); //i
    //printf("(%lu,%s)\t", hash, pass);
    hash = target_hash_function(pass); //i=1
  }
  //printf("%lu == %lu?",hash_i, hash_);
  //printf("\n");
  free(pass);
  return NULL;
}

void find_password(pwhash hash, Node ** * r_tables, int r_tables_count, FILE * file, int HASH_TABLE_SIZE) {
  //On crée un tableau pour stocker les L passL
  char ** pass = (char ** ) malloc(sizeof(char * ) * (L));
  for (int i = 0; i < L; i++) {
    pass[i] = (char * ) malloc(sizeof(char) * (M + 1));
  }

  char * candidat;
  char * res = "";
  Node ** hash_table;
  pwhash hashed_hash;

  //On stock les L passL issues de (r o h)^(i) o r différents
  for (int i = 0; i < L - 2; i++) {
    hashed_hash = hash;
    reduction(pass[i], hashed_hash, i);
    for (int j = i + 1; j < L; j++) {
      hashed_hash = target_hash_function(pass[i]);
      reduction(pass[i], hashed_hash, j);
    }
  }
  reduction(pass[L - 2], hash, L - 1);

  //On fait la recherche à travers les R r_tables des L passL calculés précedement
  for (int i = 0; i < L - 1; i++) {
    for (int k = 0; k < r_tables_count; k++) {
      candidat = find_in_hash_table(r_tables[k], HASH_TABLE_SIZE, pass[i]);
      if (candidat != NULL) { // Si le candidat n'est pas null, il y a un match
        res = get_pass(candidat, i, hash); //On récupère le pass correspondant après vérification du candidat dans res.
        if (res != NULL) { // Pour une raison qui nous échappe il arrive que parfois le candidat ne corresponde pas (collision ou erreur dans notre code), si res == NULL cela signifie qu'il n'a pas le hash attendu, il n'est donc pas valide 
          fprintf(file, "%s %lu\n", res, hash);
          printf("%s %lu\n", res, hash);

          for (int l = 0; l < L-1; l++) free(pass[l]);
          free(pass);
          return;
        }
      }
    }
  }
  fprintf(file, "\n");
  printf("\n");

  for (int i = 0; i < L; i++) free(pass[i]);
  free(pass);
}

void rainbow_attack(char ** r_tables, char * attacked_file, char * defeated_file) {
  int r_tables_count = R;
  int HASH_TABLE_SIZE = 4999;
  Node ** * hash_tables = (Node ** * ) malloc(sizeof(Node ** ) * r_tables_count);

  //On crée une r_table à partir d'un fichier et on stock son pointeur dans un tableau
  for (int i = 0; i < r_tables_count; i++) {
    hash_tables[i] = generate_hash_table_from_r_table(r_tables[i], HASH_TABLE_SIZE);
    //display_hash_table(hash_tables[i], HASH_TABLE_SIZE);   
  }

  FILE * file;
  FILE * def_file;
  file = fopen(attacked_file, "r");
  def_file = fopen(defeated_file, "w");
  if (file == NULL || def_file == NULL) {
    perror("Error while opening the file.\n");
    exit(1);
  }

  char * line = NULL;
  size_t len = 0;
  ssize_t read;
  char * pass;
  long unsigned int hash;
  char * eptr;

  //Tant que l'on lit des mots dans le fichier contenant les hash cibles, on essaye de les rechercher à travers les R r_tables
  while ((read = getline( & line, & len, file)) != -1) {
    line[20] = '\0';
    hash = (long unsigned int) strtoul(line, & eptr, 10);

    //printf("from %s to %ld\n", line, hash);
    find_password((pwhash) hash, hash_tables, r_tables_count, def_file, HASH_TABLE_SIZE);
  }
  fclose(file);
  fclose(def_file);
}

void reduction(char * pass, pwhash hash, int l_index) {
  //Get the set size of the initial set (set_size)
  pwhash rest = (hash + l_index) % (long unsigned int) set_size;
  //Make this modulo your hash : (hash+l_index) % set_size
  //Change the base from 10 to 26
  change_base(pass, rest);
}

//Change the base from 10 to 26
void change_base(char * pass, pwhash rest) {
  int base[M];
  long unsigned int pwr[M];
  pwr[0] = 1;

  //Find 26^0 to 26^M-1
  for (int k = 1; k < M; k++) {
    pwr[k] = 26 * pwr[k - 1];
  }
  //Write rest in the 26 base
  for (int i = M - 1; i >= 0; i--) {
    base[i] = rest / pwr[i];
    rest = rest % pwr[i];
  }
  //Convert to number
  for (int i = 0; i < M; i++) {
    pass[i] = base[i] + 'a';
  }
  pass[M] = '\0';
}

int main(int argc, char
  const * argv[]) {
  if (argc < R + 3) { // Test si minimum R fichiers + un fichier cible + un fichier destination
    printf("Not enougth files\n");
    exit(1);
  }
  char ** file_names = (char ** ) malloc(sizeof(char * ) * (argc - 1));
  if (file_names == NULL) {
    printf("Error main malloc");
    exit(1);
  }
  //On fait un tableau contenant tous les noms des r_tables
  for (int i = 1; i <= R; i++) {
    file_names[i - 1] = (char * ) malloc(sizeof(char) * 64);
    if (file_names == NULL) {
      printf("Error main malloc");
      exit(1);
    }
    strcpy(file_names[i - 1], argv[i]);
  }
  char * attacked_file = argv[R+1];
  char * defeated_file = argv[R+2];

  rainbow_attack(file_names, attacked_file, defeated_file);
  return 0;
}