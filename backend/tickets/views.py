from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from django.db.models.functions import TruncDate
from .models import Ticket
from .serializers import TicketSerializer
from .services.llm import classify_ticket


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ['category', 'priority', 'status']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at']

    # 🔥 Override create to auto-classify
    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        description = data.get("description")

        if not description:
            return Response(
                {"error": "Description is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # If category or priority missing → auto classify
        if not data.get("category") or not data.get("priority"):
            classification = classify_ticket(description)
            data["category"] = classification["category"]
            data["priority"] = classification["priority"]

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # 🔥 Stats endpoint
    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_tickets = Ticket.objects.count()
        open_tickets = Ticket.objects.filter(status='open').count()

        distinct_days = (
            Ticket.objects
            .annotate(day=TruncDate('created_at'))
            .values('day')
            .distinct()
            .count()
        )

        average_per_day = (
            total_tickets / distinct_days
            if distinct_days > 0 else 0
        )

        priority_breakdown = (
            Ticket.objects
            .values('priority')
            .annotate(count=Count('id'))
        )

        category_breakdown = (
            Ticket.objects
            .values('category')
            .annotate(count=Count('id'))
        )

        return Response({
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "average_tickets_per_day": average_per_day,
            "priority_breakdown": priority_breakdown,
            "category_breakdown": category_breakdown,
        })

    # 🔥 Optional separate classify endpoint
    @action(detail=False, methods=['post'])
    def classify(self, request):
        description = request.data.get("description")

        if not description:
            return Response(
                {"error": "Description is required"},
                status=400
            )

        result = classify_ticket(description)
        return Response(result)