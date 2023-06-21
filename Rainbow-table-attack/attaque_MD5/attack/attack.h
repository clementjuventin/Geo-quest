#include <stdio.h>
#include <stdlib.h>
#include <openssl/md5.h>
#include <string.h>
#include <assert.h>
#include <math.h>

#include "hash_table_attack.h"

#define HASHSIZE 8 // In bytes
#define SHIFT 3 // In bits

typedef struct{
  char* pass0;
  char* passL;
} Line;

typedef uint64_t pwhash;

void rainbow_create(char ** file_names, int file_count);
char* generate_r_table(char* file_name, char* first_pass);
Line generate_line();
void change_base(char* pass, pwhash rest);
char* generate_password(char* last);
void reduction(char* pass, pwhash hash, int l_index);
char* generate_r_table_based_on_file(char* file_name);
Node ** generate_hash_table_from_r_table(char * r_table_name, int HASH_TABLE_SIZE);
void reduction(char * pass, pwhash hash, int l_index);
void change_base(char * pass, pwhash rest);

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
