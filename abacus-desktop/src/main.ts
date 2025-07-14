// Types
interface Interface {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Flow {
  id: string;
  name: string;
  interfaceId?: string; // Référence vers l'interface parente
  sources: number;
  targets: number;
  transformations: number;
  complexity: 'simple' | 'modérée' | 'complexe';
  userLevel: 'junior' | 'confirmé' | 'expert'; // Nouveau champ pour le niveau utilisateur
  dataVolume: number;
  frequency: 'unique' | 'quotidien' | 'hebdomadaire' | 'mensuel';
  environment: 'dev' | 'test' | 'prod';
  // Nouveaux paramètres de configuration
  maxTranscodifications: number;
  maxSources: number;
  maxTargets: number;
  maxRules: number;
  flowType: 'synchrone' | 'asynchrone';
  architecturePivot: boolean;
  messagingQueue: boolean;
  // Gestion des erreurs et logs
  gestionErreurstechniques: boolean;
  gestionErreursFonctionnelles: boolean;
  gestionLogs: boolean;
  cost?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CalculationResult {
  totalCost: number;
  breakdown: {
    development: number;
    testing: number;
    deployment: number;
    maintenance: number;
  };
  timeEstimate: string;
  complexity: string;
  recommendations: string[];
}

// Gestion des données
class FlowManager {
  private flows: Flow[] = [];
  private interfaces: Interface[] = [];
  private currentEditingId: string | null = null;

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    // Chargement des flux
    const storedFlows = localStorage.getItem('talend-flows');
    if (storedFlows) {
      try {
        const data = JSON.parse(storedFlows);
        this.flows = data.map((flow: any) => ({
          ...flow,
          createdAt: new Date(flow.createdAt),
          updatedAt: new Date(flow.updatedAt)
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des flux:', error);
        this.flows = [];
      }
    }

    // Chargement des interfaces
    const storedInterfaces = localStorage.getItem('talend-interfaces');
    if (storedInterfaces) {
      try {
        const data = JSON.parse(storedInterfaces);
        this.interfaces = data.map((interfaceItem: any) => ({
          ...interfaceItem,
          createdAt: new Date(interfaceItem.createdAt),
          updatedAt: new Date(interfaceItem.updatedAt)
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des interfaces:', error);
        this.interfaces = [];
      }
    }
  }

  private saveData(): void {
    try {
      localStorage.setItem('talend-flows', JSON.stringify(this.flows));
      localStorage.setItem('talend-interfaces', JSON.stringify(this.interfaces));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }

  // Gestion des interfaces
  addInterface(interfaceData: Omit<Interface, 'id' | 'createdAt' | 'updatedAt'>): Interface {
    const newInterface: Interface = {
      ...interfaceData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.interfaces.push(newInterface);
    this.saveData();
    return newInterface;
  }

  updateInterface(id: string, interfaceData: Partial<Interface>): Interface | null {
    const index = this.interfaces.findIndex(i => i.id === id);
    if (index === -1) return null;

    this.interfaces[index] = {
      ...this.interfaces[index],
      ...interfaceData,
      updatedAt: new Date()
    };
    
    this.saveData();
    return this.interfaces[index];
  }

  deleteInterface(id: string): boolean {
    const index = this.interfaces.findIndex(i => i.id === id);
    if (index === -1) return false;

    // Supprimer aussi tous les flux associés
    this.flows = this.flows.filter(f => f.interfaceId !== id);
    this.interfaces.splice(index, 1);
    this.saveData();
    return true;
  }

  getInterface(id: string): Interface | null {
    return this.interfaces.find(i => i.id === id) || null;
  }

  getAllInterfaces(): Interface[] {
    return [...this.interfaces].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  // Gestion des flux (mise à jour)
  addFlow(flowData: Omit<Flow, 'id' | 'createdAt' | 'updatedAt'>): Flow {
    const flow: Flow = {
      ...flowData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.flows.push(flow);
    this.saveData();
    return flow;
  }

  updateFlow(id: string, flowData: Partial<Flow>): Flow | null {
    const index = this.flows.findIndex(f => f.id === id);
    if (index === -1) return null;

    this.flows[index] = {
      ...this.flows[index],
      ...flowData,
      updatedAt: new Date()
    };
    
    this.saveData();
    return this.flows[index];
  }

  deleteFlow(id: string): boolean {
    const index = this.flows.findIndex(f => f.id === id);
    if (index === -1) return false;

    this.flows.splice(index, 1);
    this.saveData();
    return true;
  }

  getFlow(id: string): Flow | null {
    return this.flows.find(f => f.id === id) || null;
  }

  getAllFlows(): Flow[] {
    return [...this.flows].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  getFlowsByInterface(interfaceId: string): Flow[] {
    return this.flows.filter(f => f.interfaceId === interfaceId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  duplicateFlow(id: string): Flow | null {
    const originalFlow = this.getFlow(id);
    if (!originalFlow) return null;

    const duplicatedFlow = this.addFlow({
      ...originalFlow,
      name: `${originalFlow.name} (copie)`
    });

    return duplicatedFlow;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  setCurrentEditingId(id: string | null): void {
    this.currentEditingId = id;
  }

  getCurrentEditingId(): string | null {
    return this.currentEditingId;
  }
}

// Calculateur de coûts
class CostCalculator {
  private complexityMultipliers = {
    simple: 0.8,
    modérée: 1.0,
    complexe: 1.4
  };

  private environmentMultipliers = {
    dev: 0.9,
    test: 1.0,
    prod: 1.1
  };

  private frequencyMultipliers = {
    unique: 1.0,
    quotidien: 1.1,
    hebdomadaire: 1.05,
    mensuel: 1.02
  };

  private userLevelMultipliers = {
    junior: 1.5,    // +50% de temps (0-2 ans)
    confirmé: 1.0,  // Temps de référence (2-5 ans)
    expert: 0.8    // -20% de temps (5+ ans)
  };

  private flowTypeMultipliers = {
    synchrone: 1.0,    // Temps de référence
    asynchrone: 1.2    // +20% de temps pour la complexité asynchrone
  };

  calculateCost(flow: Flow): CalculationResult {
    // Calcul de base en jours - formule plus réaliste
    let baseDays = 2; // Jours de base minimum

    // Calcul des composants en jours (valeurs réduites)
    const sourceDays = flow.sources * 0.8; // 0.8 jour par source
    const targetDays = flow.targets * 1.2; // 1.2 jour par cible
    const transformationDays = flow.transformations * 0.3; // 0.3 jour par transformation
    
    // Nouveaux paramètres de configuration
    const transcodificationDays = flow.maxTranscodifications * 0.5; // 0.5 jour par transcodification
    const rulesDays = flow.maxRules * 0.25; // 0.25 jour par règle métier
    
    // Bonus/malus pour les options spéciales
    const architecturePivotBonus = flow.architecturePivot ? 1.5 : 0; // +1.5 jours pour architecture pivot
    const messagingQueueBonus = flow.messagingQueue ? 1.0 : 0; // +1 jour pour messaging queue
    
    // Gestion des erreurs et logs
    const gestionErreursTechniquesBonus = flow.gestionErreurstechniques ? 0.5 : 0; // +0.5 jour pour gestion erreurs techniques
    const gestionErreursFonctionnellesBonus = flow.gestionErreursFonctionnelles ? 0.5 : 0; // +0.5 jour pour gestion erreurs fonctionnelles
    const gestionLogsBonus = flow.gestionLogs ? 0.5 : 0; // +0.5 jour pour gestion des logs
    
    // Volume de données - impact limité
    const volumeImpact = Math.min(Math.log10(flow.dataVolume / 100 + 1), 2); // Max 2 jours d'impact

    // Application des multiplicateurs (réduits)
    const complexityMultiplier = this.complexityMultipliers[flow.complexity];
    const environmentMultiplier = this.environmentMultipliers[flow.environment];
    const frequencyMultiplier = this.frequencyMultipliers[flow.frequency];
    const userLevelMultiplier = this.userLevelMultipliers[flow.userLevel];
    const flowTypeMultiplier = this.flowTypeMultipliers[flow.flowType];

    // Calcul total en jours
    const rawDays = baseDays + sourceDays + targetDays + transformationDays + transcodificationDays + rulesDays + architecturePivotBonus + messagingQueueBonus + gestionErreursTechniquesBonus + gestionErreursFonctionnellesBonus + gestionLogsBonus + volumeImpact;
    let totalDays = rawDays * complexityMultiplier * environmentMultiplier * frequencyMultiplier * userLevelMultiplier * flowTypeMultiplier;
    
    // Arrondir et limiter entre 1 et 100 jours
    totalDays = Math.max(1, Math.min(100, Math.round(totalDays)));

    // Répartition des jours par phase
    const development = Math.ceil(totalDays * 0.45);
    const testing = Math.ceil(totalDays * 0.25);
    const deployment = Math.ceil(totalDays * 0.15);
    const maintenance = Math.ceil(totalDays * 0.15);

    // Calcul du coût en euros (600€ par jour) - pour référence
    const totalCost = totalDays * 600;

    // Estimation de temps formatée
    const weeks = Math.ceil(totalDays / 5);
    const timeEstimate = `${totalDays}j (${weeks} sem.)`;

    // Recommandations
    const recommendations = this.generateRecommendations(flow, totalDays);

    return {
      totalCost: totalDays, // On retourne les jours dans totalCost pour compatibilité
      breakdown: { development, testing, deployment, maintenance },
      timeEstimate,
      complexity: flow.complexity,
      recommendations
    };
  }

  private generateRecommendations(flow: Flow, totalDays: number): string[] {
    const recommendations: string[] = [];

    if (flow.sources > 5) {
      recommendations.push('Considérez la consolidation des sources de données');
    }

    if (flow.transformations > 20) {
      recommendations.push('Évaluez la possibilité de simplifier les transformations');
    }

    if (flow.complexity === 'complexe' && totalDays > 25) {
      recommendations.push('Envisagez un découpage en phases pour réduire les risques');
    }

    if (flow.frequency === 'quotidien' && flow.dataVolume > 1000) {
      recommendations.push('Optimisez les performances pour les gros volumes quotidiens');
    }

    if (flow.userLevel === 'junior' && flow.complexity === 'complexe') {
      recommendations.push('Prévoyez un accompagnement senior pour ce développeur junior');
    }

    if (flow.userLevel === 'expert' && flow.complexity === 'simple') {
      recommendations.push('Ce développeur expert pourrait optimiser davantage ce flux simple');
    }

    if (recommendations.length === 0) {
      recommendations.push('Configuration optimale détectée');
    }

    return recommendations;
  }
}

// Interface utilisateur
class FlowUI {
  private flowManager: FlowManager;
  private calculator: CostCalculator;
  private modal: HTMLElement;
  private modalOverlay: HTMLElement;
  private form: HTMLFormElement;
  private interfaceModal: HTMLElement;
  private interfaceForm: HTMLFormElement;
  private tableBody: HTMLElement;
  private emptyState: HTMLElement;

  constructor() {
    this.flowManager = new FlowManager();
    this.calculator = new CostCalculator();
    
    // Éléments DOM
    this.modal = document.getElementById('flowModal')!;
    this.modalOverlay = document.getElementById('modalOverlay')!;
    this.form = document.getElementById('flowForm') as HTMLFormElement;
    this.interfaceModal = document.getElementById('interfaceModal')!;
    this.interfaceForm = document.getElementById('interfaceForm') as HTMLFormElement;
    this.tableBody = document.getElementById('flowsTableBody')!;
    this.emptyState = document.getElementById('emptyState')!;

    this.initializeEventListeners();
    this.recalculateAllFlows(); // Recalculer tous les flux avec la nouvelle formule
    this.renderTable();
    this.updateStats();
  }

  private recalculateAllFlows(): void {
    // Réinitialiser les coûts pour forcer le recalcul avec la nouvelle formule
    const flows = this.flowManager.getAllFlows();
    flows.forEach(flow => {
      // Ajouter un niveau par défaut pour les flux existants
      if (!flow.userLevel) {
        this.flowManager.updateFlow(flow.id, { userLevel: 'confirmé', cost: undefined });
      } else {
        this.flowManager.updateFlow(flow.id, { cost: undefined });
      }
    });
  }

  private initializeEventListeners(): void {
    // Bouton nouvelle interface
    document.getElementById('addInterfaceBtn')?.addEventListener('click', () => {
      this.openInterfaceModal();
    });

    // Bouton nouveau flux
    document.getElementById('addFlowBtn')?.addEventListener('click', () => {
      this.openModal();
    });

    // Fermeture des modals
    document.getElementById('closeModal')?.addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('closeInterfaceModal')?.addEventListener('click', () => {
      this.closeInterfaceModal();
    });

    document.getElementById('cancelBtn')?.addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('cancelInterfaceBtn')?.addEventListener('click', () => {
      this.closeInterfaceModal();
    });

    this.modalOverlay.addEventListener('click', () => {
      this.closeModal();
      this.closeInterfaceModal();
    });

    // Soumission des formulaires
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    this.interfaceForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleInterfaceFormSubmit();
    });

    // Fermeture avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.modal.classList.contains('active')) {
          this.closeModal();
        }
        if (this.interfaceModal.classList.contains('active')) {
          this.closeInterfaceModal();
        }
      }
    });
  }

  private openInterfaceModal(interfaceId?: string): void {
    if (interfaceId) {
      // Mode édition
      const interfaceItem = this.flowManager.getInterface(interfaceId);
      if (interfaceItem) {
        this.populateInterfaceForm(interfaceItem);
        document.getElementById('interfaceModalTitle')!.textContent = 'Modifier l\'interface';
        document.getElementById('interfaceSubmitText')!.textContent = 'Mettre à jour';
      }
    } else {
      // Mode création
      this.interfaceForm.reset();
      document.getElementById('interfaceModalTitle')!.textContent = 'Nouvelle interface';
      document.getElementById('interfaceSubmitText')!.textContent = 'Créer l\'interface';
    }

    this.interfaceModal.classList.add('active');
    this.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      (document.getElementById('interfaceName') as HTMLInputElement)?.focus();
    }, 100);
  }

  private closeInterfaceModal(): void {
    this.interfaceModal.classList.remove('active');
    if (!this.modal.classList.contains('active')) {
      this.modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  private populateInterfaceForm(interfaceItem: Interface): void {
    (document.getElementById('interfaceName') as HTMLInputElement).value = interfaceItem.name;
    (document.getElementById('interfaceDescription') as HTMLTextAreaElement).value = interfaceItem.description || '';
  }

  private handleInterfaceFormSubmit(): void {
    const formData = new FormData(this.interfaceForm);
    const interfaceData = {
      name: formData.get('interfaceName') as string,
      description: formData.get('interfaceDescription') as string || undefined
    };

    this.flowManager.addInterface(interfaceData);
    this.closeInterfaceModal();
    this.renderTable();
    this.updateStats();
    this.updateInterfaceOptions();
  }

  private updateInterfaceOptions(): void {
    const select = document.getElementById('flowInterface') as HTMLSelectElement;
    const interfaces = this.flowManager.getAllInterfaces();
    
    // Vider les options existantes (sauf la première)
    while (select.children.length > 1) {
      select.removeChild(select.lastChild!);
    }

    // Ajouter les nouvelles options
    interfaces.forEach(interfaceItem => {
      const option = document.createElement('option');
      option.value = interfaceItem.id;
      option.textContent = interfaceItem.name;
      select.appendChild(option);
    });
  }

  private openModal(flowId?: string): void {
    this.flowManager.setCurrentEditingId(flowId || null);
    this.updateInterfaceOptions();
    
    if (flowId) {
      // Mode édition
      const flow = this.flowManager.getFlow(flowId);
      if (flow) {
        this.populateForm(flow);
        document.getElementById('modalTitle')!.textContent = 'Modifier le flux';
        document.getElementById('submitText')!.textContent = 'Mettre à jour';
      }
    } else {
      // Mode création
      this.form.reset();
      document.getElementById('modalTitle')!.textContent = 'Nouveau flux';
      document.getElementById('submitText')!.textContent = 'Créer le flux';
    }

    this.modal.classList.add('active');
    this.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus sur le premier champ
    setTimeout(() => {
      (document.getElementById('flowName') as HTMLInputElement)?.focus();
    }, 100);
  }

  private closeModal(): void {
    this.modal.classList.remove('active');
    if (!this.interfaceModal.classList.contains('active')) {
      this.modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    this.flowManager.setCurrentEditingId(null);
  }

  private populateForm(flow: Flow): void {
    (document.getElementById('flowInterface') as HTMLSelectElement).value = flow.interfaceId || '';
    (document.getElementById('flowName') as HTMLInputElement).value = flow.name;
    (document.getElementById('sources') as HTMLInputElement).value = flow.sources.toString();
    (document.getElementById('targets') as HTMLInputElement).value = flow.targets.toString();
    (document.getElementById('transformations') as HTMLInputElement).value = flow.transformations.toString();
    (document.getElementById('complexity') as HTMLSelectElement).value = flow.complexity;
    (document.getElementById('dataVolume') as HTMLInputElement).value = flow.dataVolume.toString();
    (document.getElementById('frequency') as HTMLSelectElement).value = flow.frequency;
    (document.getElementById('environment') as HTMLSelectElement).value = flow.environment;
    (document.getElementById('userLevel') as HTMLSelectElement).value = flow.userLevel || 'confirmé';
    
    // Nouveaux paramètres de configuration
    (document.getElementById('maxTranscodifications') as HTMLInputElement).value = flow.maxTranscodifications?.toString() || '0';
    (document.getElementById('maxSources') as HTMLInputElement).value = flow.maxSources?.toString() || '1';
    (document.getElementById('maxTargets') as HTMLInputElement).value = flow.maxTargets?.toString() || '1';
    (document.getElementById('maxRules') as HTMLInputElement).value = flow.maxRules?.toString() || '0';
    (document.getElementById('flowType') as HTMLSelectElement).value = flow.flowType || 'synchrone';
    (document.getElementById('architecturePivot') as HTMLInputElement).checked = flow.architecturePivot || false;
    (document.getElementById('messagingQueue') as HTMLInputElement).checked = flow.messagingQueue || false;
    
    // Gestion des erreurs et logs
    (document.getElementById('gestionErreurstechniques') as HTMLInputElement).checked = flow.gestionErreurstechniques || false;
    (document.getElementById('gestionErreursFonctionnelles') as HTMLInputElement).checked = flow.gestionErreursFonctionnelles || false;
    (document.getElementById('gestionLogs') as HTMLInputElement).checked = flow.gestionLogs || false;
  }

  private handleFormSubmit(): void {
    const formData = new FormData(this.form);
    const flowData = {
      name: formData.get('flowName') as string,
      interfaceId: (formData.get('flowInterface') as string) || undefined,
      sources: parseInt(formData.get('sources') as string),
      targets: parseInt(formData.get('targets') as string),
      transformations: parseInt(formData.get('transformations') as string),
      complexity: formData.get('complexity') as 'simple' | 'modérée' | 'complexe',
      dataVolume: parseInt(formData.get('dataVolume') as string),
      frequency: formData.get('frequency') as 'unique' | 'quotidien' | 'hebdomadaire' | 'mensuel',
      environment: formData.get('environment') as 'dev' | 'test' | 'prod',
      userLevel: formData.get('userLevel') as 'junior' | 'confirmé' | 'expert',
      // Nouveaux paramètres de configuration
      maxTranscodifications: parseInt(formData.get('maxTranscodifications') as string) || 0,
      maxSources: parseInt(formData.get('maxSources') as string) || 1,
      maxTargets: parseInt(formData.get('maxTargets') as string) || 1,
      maxRules: parseInt(formData.get('maxRules') as string) || 0,
      flowType: formData.get('flowType') as 'synchrone' | 'asynchrone',
      architecturePivot: formData.get('architecturePivot') === 'on',
      messagingQueue: formData.get('messagingQueue') === 'on',
      // Gestion des erreurs et logs
      gestionErreurstechniques: formData.get('gestionErreurstechniques') === 'on',
      gestionErreursFonctionnelles: formData.get('gestionErreursFonctionnelles') === 'on',
      gestionLogs: formData.get('gestionLogs') === 'on'
    };

    const editingId = this.flowManager.getCurrentEditingId();
    
    if (editingId) {
      // Mise à jour
      this.flowManager.updateFlow(editingId, flowData);
    } else {
      // Création
      this.flowManager.addFlow(flowData);
    }

    this.closeModal();
    this.renderTable();
    this.updateStats();
  }

  private async renderTable(): Promise<void> {
    const interfaces = this.flowManager.getAllInterfaces();
    const flows = this.flowManager.getAllFlows();
    
    if (interfaces.length === 0 && flows.length === 0) {
      this.tableBody.style.display = 'none';
      this.emptyState.style.display = 'block';
      return;
    }

    this.tableBody.style.display = '';
    this.emptyState.style.display = 'none';

    let tableHTML = '';

    // Afficher chaque interface avec ses flux
    interfaces.forEach(interfaceItem => {
      tableHTML += this.renderInterfaceRow(interfaceItem);
      
      const interfaceFlows = this.flowManager.getFlowsByInterface(interfaceItem.id);
      interfaceFlows.forEach(flow => {
        tableHTML += this.renderFlowRow(flow, true);
      });
    });

    // Afficher les flux sans interface
    const standaloneFlows = flows.filter(flow => !flow.interfaceId);
    standaloneFlows.forEach(flow => {
      tableHTML += this.renderFlowRow(flow, false);
    });

    this.tableBody.innerHTML = tableHTML;

    // Calcul des coûts de manière asynchrone
    flows.forEach(async (flow) => {
      if (!flow.cost) {
        const costCell = document.getElementById(`cost-${flow.id}`);
        if (costCell) {
          costCell.innerHTML = '<span class="cost-loading">Calcul...</span>';
          
          // Simulation d'un délai de calcul
          setTimeout(() => {
            const result = this.calculator.calculateCost(flow);
            flow.cost = result.totalCost;
            this.flowManager.updateFlow(flow.id, { cost: result.totalCost });
            costCell.textContent = `${result.totalCost}j`; // Afficher les jours avec unité
            this.updateStats();
          }, 500 + Math.random() * 1000);
        }
      }
    });
  }

  private renderInterfaceRow(interfaceItem: Interface): string {
    const flowCount = this.flowManager.getFlowsByInterface(interfaceItem.id).length;
    const totalCost = this.flowManager.getFlowsByInterface(interfaceItem.id)
      .reduce((sum, flow) => sum + (flow.cost || 0), 0);

    return `
      <tr class="interface-row">
        <td>
          <div class="interface-name">
            <svg class="interface-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <path d="M9 9h6m-6 4h6"></path>
            </svg>
            <strong>${this.escapeHtml(interfaceItem.name)}</strong>
            <span style="color: var(--text-secondary); font-weight: normal; margin-left: auto;">
              ${flowCount} flux
            </span>
          </div>
          ${interfaceItem.description ? `<div style="color: var(--text-secondary); font-size: var(--text-sm); margin-top: var(--space-1);">${this.escapeHtml(interfaceItem.description)}</div>` : ''}
        </td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>${totalCost > 0 ? `${totalCost}j` : '-'}</td>
        <td>${this.formatDate(interfaceItem.updatedAt)}</td>
        <td>
          <div class="table-actions">
            <button class="action-btn edit" onclick="flowUI.editInterface('${interfaceItem.id}')" title="Modifier l'interface">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="action-btn delete" onclick="flowUI.deleteInterface('${interfaceItem.id}')" title="Supprimer l'interface">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  private renderFlowRow(flow: Flow, isChild: boolean): string {
    const cost = flow.cost ? `${flow.cost}j` : '<span class="cost-loading">Calcul...</span>';
    const complexityBadge = this.getComplexityBadge(flow.complexity);
    const expertiseBadge = this.getExpertiseBadge(flow.userLevel);
    const flowTypeBadge = this.getFlowTypeBadge(flow.flowType);
    const lastModified = this.formatDate(flow.updatedAt);
    const flowNameClass = isChild ? 'flow-name' : 'flow-name standalone';

    // Informations supplémentaires dans le tooltip
    const errorManagementInfo = [];
    if (flow.gestionErreurstechniques) errorManagementInfo.push('Erreurs techniques');
    if (flow.gestionErreursFonctionnelles) errorManagementInfo.push('Erreurs fonctionnelles');
    if (flow.gestionLogs) errorManagementInfo.push('Logs');
    
    const additionalInfo = `Transcodifications: ${flow.maxTranscodifications || 0} | Règles: ${flow.maxRules || 0}${flow.architecturePivot ? ' | Architecture pivot' : ''}${flow.messagingQueue ? ' | Messaging queue' : ''}${errorManagementInfo.length > 0 ? ' | Gestion: ' + errorManagementInfo.join(', ') : ''}`;

    return `
      <tr class="flow-row ${isChild ? 'child-flow' : ''}">
        <td>
          <div class="${flowNameClass}">
            <strong>${this.escapeHtml(flow.name)}</strong>
            <br>
            <small style="color: var(--text-secondary);">
              Créé le ${flow.createdAt.toLocaleDateString('fr-FR')}
            </small>
            ${additionalInfo ? `<br><small style="color: var(--text-muted); font-size: 0.7rem;" title="${additionalInfo}">${additionalInfo}</small>` : ''}
          </div>
        </td>
        <td>${flow.sources}</td>
        <td>${flow.targets}</td>
        <td>${flow.transformations}</td>
        <td>${flowTypeBadge}</td>
        <td>${complexityBadge}</td>
        <td>${expertiseBadge}</td>
        <td id="cost-${flow.id}">${cost}</td>
        <td>${lastModified}</td>
        <td>
          <div class="table-actions">
            <button class="action-btn edit" onclick="flowUI.editFlow('${flow.id}')" title="Modifier">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="action-btn duplicate" onclick="flowUI.duplicateFlow('${flow.id}')" title="Dupliquer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <button class="action-btn delete" onclick="flowUI.deleteFlow('${flow.id}')" title="Supprimer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  private getComplexityBadge(complexity: string): string {
    const badges = {
      simple: 'badge-simple',
      modérée: 'badge-moderate',
      complexe: 'badge-complex'
    };
    
    return `<span class="badge ${badges[complexity as keyof typeof badges]}">${complexity}</span>`;
  }

  private getExpertiseBadge(userLevel: string): string {
    const badges = {
      junior: { class: 'badge-junior', icon: '👶', label: 'Junior' },
      confirmé: { class: 'badge-confirmed', icon: '⚡', label: 'Confirmé' },
      expert: { class: 'badge-expert', icon: '🚀', label: 'Expert' }
    };
    
    const badge = badges[userLevel as keyof typeof badges];
    return `<span class="badge ${badge.class}">${badge.icon} ${badge.label}</span>`;
  }

  private getFlowTypeBadge(flowType: 'synchrone' | 'asynchrone'): string {
    const badges = {
      synchrone: { class: 'badge-sync', icon: '🔄', label: 'Synchrone' },
      asynchrone: { class: 'badge-async', icon: '⚡', label: 'Asynchrone' }
    };
    
    const badge = badges[flowType as keyof typeof badges];
    return `<span class="badge ${badge.class}">${badge.icon} ${badge.label}</span>`;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  private formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Aujourd\'hui';
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private updateStats(): void {
    const flows = this.flowManager.getAllFlows();
    const interfaces = this.flowManager.getAllInterfaces();
    const totalFlows = flows.length;
    const totalInterfaces = interfaces.length;
    const totalCost = flows.reduce((sum, flow) => sum + (flow.cost || 0), 0);

    // Mise à jour des statistiques dans le header
    const totalInterfacesElement = document.getElementById('totalInterfaces');
    const totalFlowsElement = document.getElementById('totalFlows');
    const totalCostElement = document.getElementById('totalCost');
    
    if (totalInterfacesElement) {
      totalInterfacesElement.textContent = totalInterfaces.toString();
    }
    
    if (totalFlowsElement) {
      totalFlowsElement.textContent = totalFlows.toString();
    }
    
    if (totalCostElement) {
      totalCostElement.textContent = totalCost > 0 ? `${totalCost}j` : '0j'; // Afficher avec l'unité "j"
    }
  }

  // Méthodes publiques pour les actions du tableau
  public editFlow(id: string): void {
    this.openModal(id);
  }

  public deleteFlow(id: string): void {
    const flow = this.flowManager.getFlow(id);
    if (!flow) return;

    if (confirm(`Êtes-vous sûr de vouloir supprimer le flux "${flow.name}" ?`)) {
      this.flowManager.deleteFlow(id);
      this.renderTable();
      this.updateStats();
    }
  }

  public duplicateFlow(id: string): void {
    const duplicatedFlow = this.flowManager.duplicateFlow(id);
    if (duplicatedFlow) {
      this.renderTable();
      this.updateStats();
      // Optionnel : ouvrir directement en édition
      setTimeout(() => {
        this.editFlow(duplicatedFlow.id);
      }, 300);
    }
  }

  public editInterface(id: string): void {
    this.openInterfaceModal(id);
  }

  public deleteInterface(id: string): void {
    const interfaceItem = this.flowManager.getInterface(id);
    if (!interfaceItem) return;

    if (confirm(`Êtes-vous sûr de vouloir supprimer l'interface "${interfaceItem.name}" ?`)) {
      this.flowManager.deleteInterface(id);
      this.renderTable();
      this.updateStats();
    }
  }
}

// Initialisation
let flowUI: FlowUI;

// Exposition globale pour les événements onclick
(window as any).flowUI = null;

document.addEventListener('DOMContentLoaded', () => {
  flowUI = new FlowUI();
  (window as any).flowUI = flowUI;
});
