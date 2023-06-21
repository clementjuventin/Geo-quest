#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <stdio.h>

typedef struct node {
    char *pass0;
    char *passL;
    struct node * next;
} Node;

Node *create_node();
bool check_nodes(Node* entry, char* pass);
Node** init_hash_table(Node **hash_table, int HASH_TABLE_SIZE);
int get_hash(char *pass, int modulo);
void clear_hash_table(Node **hash_table, int HASH_TABLE_SIZE);
void clear_list(Node *entry);

Node* add_node(char* pass0, char* passL, Node *node);
void insert_pass(Node **hash_table, int HASH_TABLE_SIZE, char* pass0, char* passL);
void display_hash_table(Node** hash_table, int HASH_TABLE_SIZE);
char * find_in_hash_table(Node ** hash_table, int HASH_TABLE_SIZE, char *passL);