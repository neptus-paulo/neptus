import AccountConfigForm from "@/components/forms/AccountConfigForm";
import InstallAppButton, { InstallInfo } from "@/components/InstallAppButton";
import IOSInstallInfo from "@/components/IOSInstallInfo";
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Configurations = () => {
  return (
    <main className="space-y-5">
      <PageHeader
        title="Configurações"
        description="Mantenha os dados atualizados"
      />

      <Tabs defaultValue="conta" className="space-y-5">
        <TabsList className="flex w-full p-0">
          <TabsTrigger value="conta">Conta</TabsTrigger>
          <TabsTrigger value="app">App</TabsTrigger>
        </TabsList>
        <TabsContent value="conta">
          <AccountConfigForm />
        </TabsContent>
        <TabsContent value="app" className="space-y-4">
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold text-lg mb-4">Instalação do App</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Instale o Neptus em seu dispositivo para ter acesso rápido e
                  uma experiência melhor.
                </p>
                <div className="flex items-center gap-4">
                  <InstallAppButton variant="default" text="Instalar App" />
                  <InstallInfo />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">
                  Vantagens do App Instalado:
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Acesso rápido pela tela inicial</li>
                  <li>• Funciona offline</li>
                  <li>• Notificações quando disponível</li>
                  <li>• Interface otimizada</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Informações específicas para iOS */}
          <IOSInstallInfo />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Configurations;
