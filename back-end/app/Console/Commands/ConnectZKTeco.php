<?php
// app/Console/Commands/ConnectZKTeco.php
namespace App\Console\Commands;

use Jmrashed\Zkteco\Lib\ZKTeco;  // ← Namespace correct v1.2

use Illuminate\Console\Command;

class ConnectZKTeco extends Command
{
    protected $signature = 'zkteco:connect {device_ip} {--port=4370}';
    protected $description = 'Connect to ZKTeco SpeedFace V5L';

    public function handle()
    {
        $ip = $this->argument('device_ip');
        $port = $this->option('port');

        $zk = new ZKTeco($ip, $port);  // Fonctionne maintenant

        if ($zk->connect()) {
            $this->info('✅ Connecté au SpeedFace V5L: ' . $ip);
            $users = $zk->getUser();
            $this->table(['UID', 'PIN', 'Name'], collect($users)->map(fn($u) => [$u[0], $u[1], $u[2]]));
            $zk->disconnect();
        } else {
            $this->error('❌ Échec : Vérifiez IP/port (4370 UDP), firewall, ext-sockets activé php.ini.');
        }
    }
}
