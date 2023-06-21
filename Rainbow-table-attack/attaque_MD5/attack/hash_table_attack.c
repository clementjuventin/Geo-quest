#include "./hash_table_attack.h"

Node *create_node(){
    return NULL;
}

Node** init_hash_table(Node **hash_table, int HASH_TABLE_SIZE){
    hash_table = (Node**) malloc(sizeof(Node*)*HASH_TABLE_SIZE);
    if(hash_table == NULL) { printf("Error init_hash_table malloc"); exit(1); }

    for(int i=0; i<HASH_TABLE_SIZE; i++)
        hash_table[i] = create_node();
    return hash_table;
}

void display_hash_table(Node** hash_table, int HASH_TABLE_SIZE){
  for (int j = 0; j < HASH_TABLE_SIZE; j++)
    {
      Node *tmp = hash_table[j];
      while (tmp!=NULL)
      {
        printf("%d | next %d | pass0 %s | passL %s\n",j, tmp->next != NULL, tmp->pass0, tmp->passL); 
        tmp = tmp->next;
      }
      printf("\n");
    }
}

char * find_in_hash_table(Node ** hash_table, int HASH_TABLE_SIZE, char *passL){
    for (int j = 0; j < HASH_TABLE_SIZE; j++)
    {
        Node *tmp = hash_table[j];
        while (tmp!=NULL)
        {
            if(strcmp(passL, tmp->passL)==0) {
                return tmp->pass0;
            }
            tmp = tmp->next;
        }
    }
    return NULL;
}

Node* add_node(char* pass0, char* passL, Node *node){
    Node *newNode = (Node*) malloc(sizeof(Node));
    if(newNode == NULL) { printf("Error add_node malloc"); exit(1); }

    newNode->passL = (char * ) malloc(sizeof(char)*strlen(passL));
    newNode->pass0 = (char * ) malloc(sizeof(char)*strlen(pass0));
    if(newNode->passL == NULL) { printf("Error add_node malloc"); exit(1); }
    if(newNode->pass0 == NULL) { printf("Error add_node malloc"); exit(1); }

    strcpy(newNode->passL, passL);
    strcpy(newNode->pass0, pass0);
    newNode->next = node;

    return newNode;
}

//clear hashtable
void clear_hash_table(Node **hash_table, int HASH_TABLE_SIZE){
    for(int i=0; i<HASH_TABLE_SIZE; i++)
        clear_list(hash_table[i]);
    free(hash_table);
}

void clear_list(Node *entry){
    Node* tmp, *tmp2;
    tmp = entry;
    while(tmp!=NULL){
        tmp2 = tmp->next;
        free(tmp);
        tmp = tmp2;
    }
}

bool check_nodes(Node* entry, char* pass){
    Node *tmp = entry;
    while(tmp!=NULL){
        if(strcmp(tmp->passL, pass) == 0 ) return true;
        tmp = tmp->next;
    }
    return false;
}

void insert_pass(Node **hash_table, int HASH_TABLE_SIZE, char* pass0, char* passL){
    int hash = get_hash(passL, HASH_TABLE_SIZE);

    hash_table[hash] = add_node(pass0, passL, hash_table[hash]);
}

int get_hash(char *pass, int modulo){
    int BASE = 26;
    int i = 0;
    unsigned long long pwr = 1;
    unsigned long long hash = 0;
    while(pass[i] != '\0'){
        hash += ((int) pass[i] - 'a') * pwr;
        pwr *= BASE;
        i++;
    }
    hash = hash % modulo;
    return hash;
}