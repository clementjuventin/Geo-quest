package iut.projet.controller;

public interface StorageInterractionListener {
    //Lorsque la tâche demandée (upload ou download) a été terminée
    public void complete();
    public void failed();
}
