#include <stdio.h>
#include <stdlib.h>
#include <openssl/md5.h>
#include <string.h>
#include <assert.h>
#include <math.h>

#define HASHSIZE 8 // In bytes
#define SHIFT 3 // In bits

typedef uint64_t pwhash;

typedef struct node {
  char *pass;
  struct node *next;
} Node;


pwhash target_hash_function(char *pwd){
  unsigned char md5[MD5_DIGEST_LENGTH] = {0};   //MD5_DIGEST_LENGTH = 16 (octets) | Déclare un tableau d'unsigned char de longeur 16 initialisé avec des 0.
  MD5((const unsigned char *)pwd, strlen(pwd), md5);
  char hexamd5hash[2*HASHSIZE+1];               //HASHSIZE = 8 (bytes) | 17 cases soit 16 plus une pour terminer le mot.
  hexamd5hash[2*HASHSIZE]='\0';
  for (int i=0; i < HASHSIZE; i++) {
    sprintf(hexamd5hash + 2*i, "%02x", md5[i]);
  }
  pwhash md5hash = strtoull(hexamd5hash, NULL, 16);
  pwhash myhash = (md5hash << SHIFT)|(md5hash >> (8*HASHSIZE - SHIFT));
  return myhash;
}

int main(int argc, char const * argv[]) {
  if (argc < 3) {
    printf("Not enougth files\n");
    exit(1);
  }
  
  //Noms des fichiers reçu en argument
  char * pass_file_name = argv[1];
  char * hash_file_name = argv[2];

  FILE * pass_file;
  FILE * hash_file;
  pass_file = fopen(pass_file_name, "r");

  Node * list = NULL;
  Node * tmp, * tmp2;

  char * line = NULL;
  size_t len = 0;
  ssize_t read;
  //Lecture du fichier contenant les pass + ajout dans une liste de pointeurs
  while ((read = getline( & line, & len, pass_file)) != -1) {
    line[strlen(line)-1] = '\0';
    tmp = list;
    list = (Node*) malloc(sizeof(Node));
    list->pass = (char *) malloc(sizeof(char) * strlen(line));

    strcpy(list->pass, line);
    list->next = tmp;
  }
  fclose(pass_file);

  hash_file = fopen(hash_file_name, "w");

  //Tant qu'on a des pass en réserve on écrit leur hash dans le ficher cible
  tmp = list;
  while (tmp != NULL)
  {
    fprintf(hash_file, "%lu\n", target_hash_function(tmp->pass));
    free(tmp->pass);
    tmp2 = tmp->next;
    free(tmp);
    tmp = tmp2;
  }
  fclose(hash_file);
}