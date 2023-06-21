#include "./generate_tables.h"
#include "./hashtable.h"
//gcc ./generation/generate_tables.c ./generation/hashtable.c -o generate.o -lcrypto
#define M 6
#define L 1000
#define R 10
#define N 100000
#define set_size powl(26, M)

/* main.c */
int main(int argc, char * argv[]) {
  //Crée un tableau avec tous les noms de fichiers à crée
  char **file_names = (char**) malloc(sizeof(char *) * (argc-1));
  if (file_names == NULL) { printf("Error main malloc"); exit(1); }
  for(int i = 1; i<argc; i++){
    file_names[i-1] = (char*) malloc(sizeof(char) * 64);
    if (file_names == NULL) { printf("Error main malloc"); exit(1); }
    strcpy(file_names[i-1],argv[i]);
  }
  rainbow_create(file_names, argc-1);
}

void rainbow_create(char ** file_names, int file_count) {
  char * first_pass = (char * ) malloc(sizeof(char) * (M + 1));
  if (first_pass == NULL) {
    printf("Error generate_r_table malloc");
    exit(1);
  }

  //On commence la création à pass0 = "aaaaaa" pour on incrémentera la dernière lettre comme ça tous les pass0 sont différents
  first_pass[M] = '\0';
  for (int i = 0; i < M; i++) first_pass[i] = 'a';

  //Dans le cas où on souhaite se baser su un dictionnaire
  if(file_count == R+1){
    generate_r_table_based_on_file(file_names[R]);
    printf("Table %s was generated.\n", file_names[R]);
    return;
  }
  
  //Génère les tables des fichiers en fonction de L, N et R
  for (int i = 0; i < file_count; i++) {
    if (file_names[i] == NULL) break;
    else first_pass = generate_r_table(file_names[i], first_pass);
    printf("%d : Table %s was generated.\n", i + 1, file_names[i]);
  }
  
}

//Generate a r_table
char * generate_r_table_based_on_file(char * file_name) {
  //Ouverture du fichier
  FILE * file;
  file = fopen(file_name, "r");
  if (file == NULL) {perror("Error while opening the file.\n");exit(1);}

  char * ligne = NULL;
  size_t len = 0;
  ssize_t read;
  char* pass;
  int i = 0;

  //Récupérer le nombre de ligne pas efficacement
  int ligne_count = 0;
  while ((read = getline( & ligne, & len, file)) != -1) ligne_count++;
  fclose(file);

  Line line[ligne_count];

  file = fopen(file_name, "r");
  if (file == NULL) {perror("Error while opening the file.\n");exit(1);}
  
  //Récupérer les lignes
  while ((read = getline( & ligne, & len, file)) != -1) {
    ligne[M] = '\0';
    pass = (char * ) malloc(sizeof(char) * M + 1);
    if (pass == NULL) { printf("Error generate_r_table_based_on_file malloc"); exit(1); }
    strcpy(pass, ligne);

    line[i] = generate_line(pass);
    i++;
  }
  fclose(file);
  file = fopen(file_name, "w");
  if (file == NULL) {perror("Error while opening the file.\n");exit(1);}
  //Ecrire les lignes
  for (int i = 0; i < ligne_count; i++) {
    fprintf(file, "%s %s\n", line[i].pass0, line[i].passL);
    free(line[i].pass0);
    free(line[i].passL);
  }
  fclose(file);
}

//Generate a r_table
char * generate_r_table(char * file_name, char * first_pass) {
  //Ouverture du fichier
  FILE * file;
  file = fopen(file_name, "w");
  if (file == NULL) {
    perror("Error while opening the file.\n");
    exit(1);
  }

  int HASH_TABLE_SIZE = 4999;
  Node ** hash_table;
  hash_table = init_hash_table(hash_table, HASH_TABLE_SIZE);

  Line line;
  line.pass0 = first_pass;
  for (int i = 0; i < N; i++) {
    line = generate_line(line.pass0);
    //Vérifier doublons/////////////////////////////////// printf("%d/%d\tError with %s\n", err_count, i,line.passL);
    if (!insert_pass(hash_table, HASH_TABLE_SIZE, line.passL)) i--;
    else fprintf(file, "%s %s\n", line.pass0, line.passL);
    //Write line
    line.pass0 = generate_password(line.pass0); // <- free(line.pass0);
    free(line.passL);
  }
  fclose(file);
  clear_hash_table(hash_table, HASH_TABLE_SIZE);
  return line.pass0;
}

//Generate a line
Line generate_line(char * pass0) {
  char * pass;
  pwhash hash;
  Line line;

  line.pass0 = pass0; ///////////////////////////////

  pass = (char * ) malloc(sizeof(char) * M + 1);
  if (pass == NULL) {
    printf("Error generate_line malloc");
    exit(1);
  }

  strcpy(pass, line.pass0);

  for (int i = 0; i < L; i++) {
    hash = target_hash_function(pass);
    reduction(pass, hash, i);
  }
  line.passL = pass;
  return line;
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
}

// Generate a random password of 'size' letters
/*
char* generate_random_password(int seed, int size){
  char* pass = (char*) malloc(sizeof(char)*size+1);
  if(pass == NULL) {
    printf("Error generate_password malloc");
    exit(1);
  }
  
  pass[size] = '\0';
  for(int i=0; i<size; i++)
    pass[i] = (char) floor(rand() % 26) + 'a';//Get random letter ///////////////////////////////////////////
  
  return pass;
}
*/

// Generate a random password of 'size' letters | incrémentation de la derniere lettre du dernier mot de passe
char * generate_password(char * last) {
  char * pass = (char * ) malloc(sizeof(char) * M + 1);
  if (pass == NULL) {
    printf("Error generate_password malloc");
    exit(1);
  }
  strcpy(pass, last);
  free(last);

  int i;
  for (i = M - 1; i >= 0; i--) {
    if (pass[i] == 'z') {
      pass[i] = 'a';
      continue;
    }
    break;
  }
  if (pass[0] == 'z') exit(1);

  pass[i] = pass[i] + 1;

  return pass;
}

void reduction(char * pass, pwhash hash, int l_index) {
  //Get the set size of the initial set (set_size)
  pwhash rest = (hash + l_index) % (long unsigned int) set_size;
  //Make this modulo your hash : (hash+l_index) % set_size
  //Change the base from 10 to 26
  change_base(pass, rest);
}
