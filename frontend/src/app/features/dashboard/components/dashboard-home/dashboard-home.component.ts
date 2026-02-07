import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { StatsCardComponent } from '../stats-card/stats-card.component';
import { DashboardService } from '../../services/dashboard.service';
import { Statistic } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule, StatsCardComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  statistics: Statistic[] = [];
  private monthlyChart?: Chart;
  currentDate = new Date();
  
  // Données supplémentaires
  upcomingEvents = [
    {
      title: 'Distribution alimentaire Nord',
      date: new Date(),
      time: '09:00 - 12:00',
      location: 'Centre communautaire Nord',
      status: 'confirmed'
    },
    {
      title: 'Réunion des bénévoles',
      date: new Date(Date.now() + 86400000),
      time: '14:30 - 16:00',
      location: 'Siège OMNIA',
      status: 'planned'
    },
    {
      title: 'Collecte de fonds mensuelle',
      date: new Date(Date.now() + 2 * 86400000),
      time: '10:00 - 18:00',
      location: 'Centre-ville',
      status: 'planned'
    }
  ];
  
  // Stats rapides
  totalFamilies = 156;
  totalDonations = 125000;
  annualTotal = 285000;
  growthRate = 18.5;
  pendingFamilies = 12;
  urgentNeeds = 7;
  completedDistributions = 43;
  activeVolunteers = 28;

  constructor(
    private dashboardService: DashboardService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadStatistics();
    this.loadUpcomingEvents();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initChart();
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private loadStatistics(): void {
    this.statistics = this.dashboardService.getStatistics();
  }

  private loadUpcomingEvents(): void {
    // Simulation de chargement d'événements depuis le service
    this.upcomingEvents = this.upcomingEvents.map(event => ({
      ...event,
      formattedDate: this.formatEventDate(event.date)
    }));
  }

  private initChart(): void {
    setTimeout(() => {
      const canvas = document.getElementById('monthlyDonationsChart') as HTMLCanvasElement;
      if (!canvas) {
        console.warn('Canvas element not found');
        return;
      }

      this.destroyChart(); // Détruire le graphique existant

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.warn('Canvas context not available');
        return;
      }

      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');

      this.monthlyChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
          datasets: [{
            label: 'Dons (DT)',
            data: [18500, 22100, 19500, 27400, 25200, 31800, 28900, 34100, 31200, 37500, 34200, 41000],
            borderColor: '#3b82f6',
            backgroundColor: gradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(30, 41, 59, 0.95)',
              titleColor: '#f1f5f9',
              bodyColor: '#f1f5f9',
              borderColor: '#475569',
              borderWidth: 1,
              cornerRadius: 8,
              padding: 12,
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('fr-TN', {
                      style: 'currency',
                      currency: 'TND',
                      minimumFractionDigits: 0
                    }).format(context.parsed.y);
                  }
                  return label;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#64748b',
                font: {
                  size: 12
                }
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(226, 232, 240, 0.5)'
              },
              ticks: {
                color: '#64748b',
                font: {
                  size: 12
                },
                callback: function(value) {
                  return new Intl.NumberFormat('fr-TN', {
                    style: 'currency',
                    currency: 'TND',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(Number(value));
                }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'nearest'
          },
          animations: {
            tension: {
              duration: 1000,
              easing: 'linear'
            }
          }
        }
      });
    }, 100);
  }

  private destroyChart(): void {
    if (this.monthlyChart) {
      this.monthlyChart.destroy();
      this.monthlyChart = undefined;
    }
  }

  private formatEventDate(date: Date): string {
    const now = new Date();
    const eventDate = new Date(date);
    const diffTime = Math.abs(eventDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Demain';
    return `Dans ${diffDays} jours`;
  }

  refreshData(): void {
    this.loadStatistics();
    this.loadUpcomingEvents();
    
    if (isPlatformBrowser(this.platformId)) {
      this.destroyChart();
      this.initChart();
    }
  }

  onPeriodChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const period = select.value;
    
    // Logique de filtrage selon la période
    console.log('Période sélectionnée:', period);
    
    // Ici vous mettriez à jour les données du graphique
    // selon la période sélectionnée
  }

  // Méthodes pour les actions rapides
  addFamily(): void {
    console.log('Ajouter une famille');
    // Navigation vers la page d'ajout de famille
  }

  recordDonation(): void {
    console.log('Enregistrer un don');
    // Ouvrir un modal ou naviguer
  }

  distributeAid(): void {
    console.log('Distribuer de l\'aide');
    // Logique de distribution
  }

  generateReport(): void {
    console.log('Générer un rapport');
    // Générer et télécharger un rapport
  }

  scheduleEvent(): void {
    console.log('Planifier un événement');
    // Ouvrir un formulaire d'événement
  }

  manageInventory(): void {
    console.log('Gérer le stock');
    // Navigation vers l'inventaire
  }

  addEvent(): void {
    console.log('Ajouter un événement');
    // Ouvrir un formulaire d'événement
  }
}