#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <stdio.h>

typedef struct node {
    char *passL;
    struct node * next;
} Node;

Node *create_node();
Node* add_node(char *passL, Node *node);
bool check_nodes(Node* entry, char* pass);
bool insert_pass(Node **hash_table, int HASH_TABLE_SIZE, char *pass);
Node** init_hash_table(Node **hash_table, int HASH_TABLE_SIZE);
int get_hash(char *pass, int modulo);
void clear_hash_table(Node **hash_table, int HASH_TABLE_SIZE);
void clear_list(Node *entry);
