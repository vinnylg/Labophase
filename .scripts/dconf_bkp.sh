
dconf dump / > ~/.dconf

awk '
BEGIN { RS = ""; FS = "\n" }  # Define blocos separados por linhas em branco
{
    if ($1 !~ /\[io\/elementary\/appcenter\/settings\]/) {
        print $0  # Imprime o bloco inteiro
        print ""  # Adiciona uma linha em branco após cada bloco
    }
}' ~/.dconf > ~/.dconf
