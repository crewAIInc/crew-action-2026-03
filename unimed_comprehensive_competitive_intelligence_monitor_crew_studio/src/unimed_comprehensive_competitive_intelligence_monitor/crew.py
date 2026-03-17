import os

from crewai import LLM
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import (
	SerperDevTool,
	ScrapeWebsiteTool
)





@CrewBase
class UnimedComprehensiveCompetitiveIntelligenceMonitorCrew:
    """UnimedComprehensiveCompetitiveIntelligenceMonitor crew"""

    
    @agent
    def brazilian_health_insurance_review_data_collector(self) -> Agent:
        
        return Agent(
            config=self.agents_config["brazilian_health_insurance_review_data_collector"],
            
            
            tools=[				SerperDevTool()],
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=LLM(
                model="openai/gpt-4.1-mini",
                temperature=0.7,
                
            ),
            
        )
    
    @agent
    def customer_sentiment_analysis_specialist(self) -> Agent:
        
        return Agent(
            config=self.agents_config["customer_sentiment_analysis_specialist"],
            
            
            tools=[],
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=LLM(
                model="openai/gpt-4.1-mini",
                temperature=0.7,
                
            ),
            
        )
    
    @agent
    def unimed_competitive_intelligence_analyst(self) -> Agent:
        
        return Agent(
            config=self.agents_config["unimed_competitive_intelligence_analyst"],
            
            
            tools=[],
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=LLM(
                model="openai/gpt-4.1-mini",
                temperature=0.7,
                
            ),
            
        )
    
    @agent
    def unimed_executive_report_writer(self) -> Agent:
        
        return Agent(
            config=self.agents_config["unimed_executive_report_writer"],
            
            
            tools=[],
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            apps=[
                    "google_gmail/send_email",
                    ],
            
            
            max_execution_time=None,
            llm=LLM(
                model="openai/gpt-4.1-mini",
                temperature=0.7,
                
            ),
            
        )
    
    @agent
    def market_intelligence_and_ans_regulatory_specialist(self) -> Agent:
        
        return Agent(
            config=self.agents_config["market_intelligence_and_ans_regulatory_specialist"],
            
            
            tools=[				SerperDevTool(),
				ScrapeWebsiteTool()],
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=LLM(
                model="openai/gpt-4.1-mini",
                temperature=0.7,
                
            ),
            
        )
    

    
    @task
    def collect_brazilian_health_insurance_reviews(self) -> Task:
        return Task(
            config=self.tasks_config["collect_brazilian_health_insurance_reviews"],
            markdown=False,
            
            
        )
    
    @task
    def research_competitor_promotions_and_ans_data(self) -> Task:
        return Task(
            config=self.tasks_config["research_competitor_promotions_and_ans_data"],
            markdown=False,
            
            
        )
    
    @task
    def analyze_customer_sentiment_patterns(self) -> Task:
        return Task(
            config=self.tasks_config["analyze_customer_sentiment_patterns"],
            markdown=False,
            
            
        )
    
    @task
    def generate_unimed_competitive_intelligence_insights(self) -> Task:
        return Task(
            config=self.tasks_config["generate_unimed_competitive_intelligence_insights"],
            markdown=False,
            
            
        )
    
    @task
    def create_and_send_daily_executive_report(self) -> Task:
        return Task(
            config=self.tasks_config["create_and_send_daily_executive_report"],
            markdown=False,
            
            
        )
    

    @crew
    def crew(self) -> Crew:
        """Creates the UnimedComprehensiveCompetitiveIntelligenceMonitor crew"""
        return Crew(
            agents=self.agents,  # Automatically created by the @agent decorator
            tasks=self.tasks,  # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
            chat_llm=LLM(model="openai/gpt-4.1-mini"),
        )


