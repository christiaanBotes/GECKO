import { Incident, ActivityFeedItem } from './types';

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-4091',
    title: 'Spring Boot OCR Pre-processing API throwing 500 Internal Server Error on scanned PDF conversions',
    description: 'Spring Boot OCR Pre-processing API throwing 500 Internal Server Error on scanned PDF conversions',
    severity: 'High',
    status: 'Active',
    service: 'idp-ocr-service',
    assignee: 'Unassigned',
    timestamp: 'Jun 02, 2026 15:45 UTC',
    createdAtText: 'Created 12m ago',
    logs: `2026-06-02 15:40:01.124  INFO 1 --- [io-8080-exec-4] d.b.i.ocr.OcrPreProcessorController : Processing request for scan_id_99214.pdf with profile: HIGH_ACCURACY
2026-06-02 15:40:02.551  WARN 1 --- [io-8080-exec-4] d.b.i.ocr.PdfImageExtractorExecutor  : Multi-page extraction initiated: 48 pages loaded in physical workspace.
2026-06-02 15:45:12.883 ERROR 1 --- [io-8080-exec-4] o.a.c.c.C.[.[.[/].[dispatcherServlet] : Servlet.service() threw exception
java.lang.NullPointerException: Cannot invoke "org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject.getImage()" because the return value of "org.apache.pdfbox.cos.COSName.get(String)" is null
        at de.bmw.idp.ocr.PdfImageExtractor.extractPageAssets(PdfImageExtractor.java:92)
        at de.bmw.idp.ocr.OcrPreProcessorService.prepareOcrPayload(OcrPreProcessorService.java:154)
        at de.bmw.idp.ocr.OcrPreProcessorController.convertAndProcess(OcrPreProcessorController.java:45)`,
    affectedServices: ['idp-ocr-service', 'idp-hitl-ui', 'idp-pipeline-worker'],
    slaStatus: 'At Risk - 99.8%',
    keyFindings: [
      'The multi-page PDF document contained nested proprietary vector compression types.',
      'Apache PDFBox library failed to initialize the inline rasterized graphic, returning a null image stream.',
      'A missing null pointer check in `PdfImageExtractor.java` caused the Spring Boot worker process to crash during layout structural classification.'
    ],
    fixes: [
      {
        id: 'fix-1',
        name: 'Apply Safe PDFBox Image Getter Guard',
        confidence: 96,
        description: 'Introduces protective null-guards during extraction of compressed embedded raster documents.',
        filePath: 'PdfImageExtractor.java',
        diff: [
          { lineNum: 91, content: '            PDImageXObject image = (PDImageXObject) object;', type: 'normal' },
          { lineNum: 92, content: '            BufferedImage bImage = image.getImage();', type: 'removed' },
          { lineNum: 92, content: '            if (image == null || image.getCOSObject() == null) {', type: 'added' },
          { lineNum: 93, content: '                logger.warn("Null graphic container detected. Skipping corrupt file leaf.");', type: 'added' },
          { lineNum: 94, content: '                continue;', type: 'added' },
          { lineNum: 95, content: '            }', type: 'added' },
          { lineNum: 96, content: '            BufferedImage bImage = image.getImage();', type: 'added' }
        ]
      }
    ],
    rationale: 'Adding defensive null-checks in `PdfImageExtractor` preserves the server’s parsing thread, skipping unsupported nested proprietary formats gracefully without failing the entire OCR queue execution.',
    similarIncidents: [
      { id: 'INC-3982', title: 'OCR conversion fails with OutOfMemoryError on vectorized blueprint templates' }
    ]
  },
  {
    id: 'INC-4092',
    title: 'Docker container OOM Kill triggered on idp-pipeline-worker during high-volume document classification and skill chaining',
    description: 'Docker container OOM Kill triggered on idp-pipeline-worker during high-volume document classification and skill chaining',
    severity: 'High',
    status: 'Active',
    service: 'idp-pipeline-worker',
    assignee: 'Sarah J.',
    timestamp: 'Jun 02, 2026 15:30 UTC',
    createdAtText: 'Created 27m ago',
    logs: `2026-06-02 15:28:44.221 [WARN] [worker-thread-12] d.b.i.p.SkillChainExecutor: High memory utilization resolving custom skill layout sequence.
2026-06-02 15:29:10.512 [INFO] kernel: [12948.1219] Out of memory: Killed process 3829 (idp-pipeline-worker) total-vm:4194304kB, anon-rss:2097152kB.
2026-06-02 15:30:02.109 [FATAL] docker-daemon: Container state transitioned to exited with status code 137 (OOMKilled).`,
    affectedServices: ['idp-pipeline-worker', 'idp-selfservice-ui'],
    slaStatus: 'Under Control - 99.9%',
    keyFindings: [
      'The custom skill chaining engine holds deep nested layout JSON graphs across highly concurrent parsing loops.',
      'JVM configuration did not align with Docker container memory limits (container holds 2GB limit while JVM MaxRAMPercentage allowed 2.5GB).',
      'This triggered standard kernel-level Linux OOM invocation over long-duration heavy document classifications.'
    ],
    fixes: [
      {
        id: 'fix-1',
        name: 'Align JVM Cgroup Memory Thresholds',
        confidence: 94,
        description: 'Updates active runtime Docker parameters to properly scale heap ceilings back to safe local constraints.',
        filePath: 'Dockerfile',
        diff: [
          { lineNum: 7, content: 'COPY target/idp-pipeline-worker.jar app.jar', type: 'normal' },
          { lineNum: 8, content: 'ENTRYPOINT ["java", "-jar", "app.jar"]', type: 'removed' },
          { lineNum: 8, content: 'ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-XX:+UseG1GC", "-jar", "app.jar"]', type: 'added' }
        ]
      }
    ],
    rationale: 'Aligning Java-level heap configurations to use 75% of container availability avoids server memory limits triggering system Kernels OOM overrides, avoiding pipeline interruptions.',
    similarIncidents: [
      { id: 'INC-3810', title: 'OOM Killed on deep learning entity parser during unstructured TIFF extraction' }
    ]
  },
  {
    id: 'INC-4093',
    title: 'Angular Human-in-the-loop validation dashboard failing to render color-coded low-confidence score indicator boxes due to undefined properties',
    description: 'Angular Human-in-the-loop validation dashboard failing to render color-coded low-confidence score indicator boxes due to undefined properties',
    severity: 'Med',
    status: 'Investigating',
    service: 'idp-hitl-ui',
    assignee: 'Sarah J.',
    timestamp: 'Jun 02, 2026 15:10 UTC',
    createdAtText: 'Created 1h ago',
    logs: `ERROR TypeError: Cannot read properties of undefined (reading 'confidenceLevels')
    at HumanInTheLoopComponent.renderScoreBox (human-in-the-loop.component.ts:182:39)
    at human-in-the-loop.component.ts:145:18
    at Array.forEach (<anonymous>)
    at HumanInTheLoopComponent.loadUnverifiedMetadata (human-in-the-loop.component.ts:142:32)`,
    affectedServices: ['idp-hitl-ui'],
    slaStatus: 'Under Control - 100%',
    keyFindings: [
      'When an AI score is extremely low (< 15%), the Spring Boot backend service skips sending properties in the JSON response payload.',
      'The Angular frontend is not handling missing structures gracefully, breaking the component render pipeline for operators.'
    ],
    fixes: [
      {
        id: 'fix-1',
        name: 'Add Angular Optional Chaining Guard',
        confidence: 98,
        description: 'Applies robust optional chain filters (`?.`) to prevent structural render disruptions on null scores.',
        filePath: 'human-in-the-loop.component.ts',
        diff: [
          { lineNum: 180, content: '  renderScoreBox(item: DocumentElement) {', type: 'normal' },
          { lineNum: 181, content: '    const level = item.scores.confidenceLevels;', type: 'removed' },
          { lineNum: 181, content: '    const level = item?.scores?.confidenceLevels || "UNASSIGNED";', type: 'added' },
          { lineNum: 182, content: '    this.applyBoxColor(level);', type: 'normal' }
        ]
      }
    ],
    rationale: 'Adding safe checks keeps the Angular presentation layout stable, letting reviewers edit or confirm results properly even if the classification was completely unconfident.',
    similarIncidents: [
      { id: 'INC-2911', title: 'Null reference on document classification summaries' }
    ]
  },
  {
    id: 'INC-4094',
    title: 'Spring Boot Sentiment Analyzer microservice throwing TimeoutException during LLM REST callback execution',
    description: 'Spring Boot Sentiment Analyzer microservice throwing TimeoutException during LLM REST callback execution',
    severity: 'Med',
    status: 'Investigating',
    service: 'idp-sentiment-analyzer',
    assignee: 'Unassigned',
    timestamp: 'Jun 02, 2026 14:24 UTC',
    createdAtText: 'Created 2h ago',
    logs: `2026-06-02 14:23:02,112 [DEBUG] d.b.i.s.SentimentService: Sending token payload to outbound LLM cluster...
2026-06-02 14:24:02,408 [ERROR] java.util.concurrent.TimeoutException: No response received within standard REST gateway interval of 60000ms.
        at java.util.concurrent.CompletableFuture.get(CompletableFuture.java:2095)`,
    affectedServices: ['idp-sentiment-analyzer', 'idp-pipeline-worker'],
    slaStatus: 'Under Control - 100%',
    keyFindings: [
      'Sentiment analysis engine requests long-form document summaries from the specialized generative AI models.',
      'Some high-volume multi-page unstructured PDF payloads require longer inference intervals, causing thread-level exceptions on HTTP request blocks.'
    ],
    fixes: [
      {
        id: 'fix-1',
        name: 'Increase Rest Template Read Timeouts',
        confidence: 90,
        description: 'Scales the internal HTTP read block period to 120 seconds to cover expensive document analyses.',
        filePath: 'application.yml',
        diff: [
          { lineNum: 12, content: '  http.client:', type: 'normal' },
          { lineNum: 13, content: '    read-timeout-ms: 60000', type: 'removed' },
          { lineNum: 13, content: '    read-timeout-ms: 120000', type: 'added' }
        ]
      }
    ],
    rationale: 'Extending timeouts prevents premature connection degradation on massive content digests, allowing complex generative AI analyses to complete safely.',
    similarIncidents: []
  },
  {
    id: 'INC-4095',
    title: 'PostgreSQL Database connection timeout on idp-tenant-metadata due to unindexed queries from Admin UI\'s KPI tracker',
    description: 'PostgreSQL Database connection timeout on idp-tenant-metadata due to unindexed queries from Admin UI\'s KPI tracker',
    severity: 'High',
    status: 'Active',
    service: 'idp-admin-api',
    assignee: 'Mark S.',
    timestamp: 'Jun 02, 2026 13:45 UTC',
    createdAtText: 'Created 3h ago',
    logs: `2026-06-02 13:42:01.002 # HikariPool-1 - Connection is not available, request timed out after 15000ms.
2026-06-02 13:42:15.541 FATAL: pg_stat_activity: long-running sequential scan on relation "tenant_document_metrics" detected (Dur: 145s)
Query: SELECT AVG(processing_time_ms) FROM tenant_document_metrics WHERE status = 'COMPLETED' AND region_code = 'EU-Central';`,
    affectedServices: ['idp-admin-api', 'idp-admin-ui'],
    slaStatus: 'At Risk - 99.1%',
    keyFindings: [
      'The Admin Dashboard queries large KPI summaries to display operations charts to global tenant groups.',
      'The multi-tenant stats table is missing clustered database indexes across the `region_code` and `status` columns.',
      'This triggered full-table sequences scanning layout lockouts, draining database resource pool capacity.'
    ],
    fixes: [
      {
        id: 'fix-1',
        name: 'Apply Targeted Multi-tenant Indexes',
        confidence: 95,
        description: 'Creates highly targeted relational indexes to prevent slow scans on document status filters.',
        filePath: 'V3__add_kpi_performance_index.sql',
        diff: [
          { lineNum: 1, content: '-- Add relational composite indexes for fast execution on nested metrics', type: 'normal' },
          { lineNum: 2, content: 'CREATE INDEX idx_tenant_metrics_status_region ON tenant_document_metrics (status, region_code);', type: 'added' }
        ]
      }
    ],
    rationale: 'Adding targeted database index rules ensures that multi-tenant analytical requests from Admin Dashboard execute in milliseconds rather than triggering complete slow physical drive indexes.',
    similarIncidents: []
  },
  {
    id: 'INC-4096',
    title: 'Angular Self-Service UI crashing when parsing circular dependencies in user-defined skill chain diagrams',
    description: 'Angular Self-Service UI crashing when parsing circular dependencies in user-defined skill chain diagrams',
    severity: 'Med',
    status: 'Mitigating',
    service: 'idp-selfservice-ui',
    assignee: 'Sarah J.',
    timestamp: 'Jun 02, 2026 12:15 UTC',
    createdAtText: 'Created 4h ago',
    logs: `Angular View Engine threw recursive stack exception: RangeError: Maximum call stack size exceeded
    at SkillGraphParser.detectCycle (skill-graph-parser.ts:45:21)
    at SkillGraphParser.validateNodes (skill-graph-parser.ts:32:14)`,
    affectedServices: ['idp-selfservice-ui'],
    slaStatus: 'Under Control - 100%',
    keyFindings: [
      'In the self-service workspace, users can drag and drop skill blocks (OCR -> Sentiment -> Auto-Reply).',
      'If a user unintentionally configures a recursive dependency circuit, the graph validator executes infinite traversals.',
      'This crashes the Angular browser tab due to lack of standard cycle boundary checks in the frontend graph compilation engine.'
    ],
    fixes: [
      {
        id: 'fix-1',
        name: 'Implement Topological Cycle Detection',
        confidence: 97,
        description: 'Introduces recursive loop tracking via traditional Tarjan cycle detection routines prior to compilation.',
        filePath: 'skill-graph-parser.ts',
        diff: [
          { lineNum: 40, content: '  // Recursively validate downstream links', type: 'normal' },
          { lineNum: 41, content: '  detectCycle(node, pathStack = new Set()) {', type: 'normal' },
          { lineNum: 42, content: '    if (pathStack.has(node.id)) {', type: 'added' },
          { lineNum: 43, content: '       throw new Error("Circular sequence error detected in layout chain!");', type: 'added' },
          { lineNum: 44, content: '    }', type: 'added' },
          { lineNum: 45, content: '    pathStack.add(node.id);', type: 'added' }
        ]
      }
    ],
    rationale: 'Providing a visual stack barrier during interactive flow layout modifications notifies users on improper connections, keeping the local Angular dashboard highly resilient.',
    similarIncidents: []
  },
  {
    id: 'INC-4097',
    title: 'Spring Boot Document Ingestion API blocking async file transfers due to full local disk partitions on Docker host',
    description: 'Spring Boot Document Ingestion API blocking async file transfers due to full local disk partitions on Docker host',
    severity: 'High',
    status: 'Active',
    service: 'idp-ingestion-api',
    assignee: 'Unassigned',
    timestamp: 'Jun 02, 2026 11:10 UTC',
    createdAtText: 'Created 5h ago',
    logs: `2026-06-02 11:08:04.221 [FATAL] [io-8080-exec-19] d.b.i.i.IngestionStorageWorker : Disk space full on /var/lib/docker/volumes/ingest-temp_data/_data
java.io.IOException: No space left on device: Cannot write stream block to workspace path buffer.`,
    affectedServices: ['idp-ingestion-api', 'idp-pipeline-worker'],
    slaStatus: 'Under Control - 100%',
    keyFindings: [
      'Document uploads are archived temporarily on persistent Docker host storage volumes during early preprocessing loops.',
      'Orphaned file descriptors inside the ingestion API code were never deleted after streaming to AWS S3 bucket containers, causing local disk bloat.'
    ],
    fixes: [
      {
        id: 'fix-1',
        name: 'Implement Defensive Temp File Cleanup',
        confidence: 94,
        description: 'Adds a dynamic try-finally cleanup clause around ingestion handlers to guarantee local file erasure.',
        filePath: 'IngestionStorageWorker.java',
        diff: [
          { lineNum: 45, content: '        // Ingest temp storage allocation', type: 'normal' },
          { lineNum: 46, content: '        File tempFile = createTempFile(inputStream);', type: 'normal' },
          { lineNum: 47, content: '        pipelineService.streamToBlob(tempFile);', type: 'removed' },
          { lineNum: 47, content: '        try {', type: 'added' },
          { lineNum: 48, content: '            pipelineService.streamToBlob(tempFile);', type: 'added' },
          { lineNum: 49, content: '        } finally {', type: 'added' },
          { lineNum: 50, content: '            if (tempFile.exists() && !tempFile.delete()) {', type: 'added' },
          { lineNum: 51, content: '                logger.error("Failed to release lock on temp file metadata: " + tempFile.getName());', type: 'added' },
          { lineNum: 52, content: '            }', type: 'added' },
          { lineNum: 53, content: '        }', type: 'added' }
        ]
      }
    ],
    rationale: 'Wrapping document pipeline ingestion loops within standard java try-finally constraints ensures uploaded high-res TIFF and PDF artifacts are purged instantly from host storage pools, freeing cached partition allocation block limits.',
    similarIncidents: []
  },
  {
    id: 'INC-4098',
    title: 'Spring Boot Document Summarizer fails to write structured JSON metadata back to PostgreSQL main database node',
    description: 'Spring Boot Document Summarizer fails to write structured JSON metadata back to PostgreSQL main database node',
    severity: 'High',
    status: 'Mitigating',
    service: 'idp-summarizer-service',
    assignee: 'Mark S.',
    timestamp: 'Jun 02, 2026 10:45 UTC',
    createdAtText: 'Created 6h ago',
    logs: `2026-06-02 10:43:55.214 ERROR 1 --- [jpa-async-worker] o.h.engine.jdbc.spi.SqlExceptionHelper : Connection is read-only. Queries only.
org.postgresql.util.PSQLException: ERROR: cannot execute INSERT in a read-only transaction (replica replica_0) during summary writeback...`,
    affectedServices: ['idp-summarizer-service', 'idp-admin-api'],
    slaStatus: 'At Risk - 99.4%',
    keyFindings: [
      'During automated load balancing, the Spring Boot metadata worker established database connections against a replica channel rather than the writeable Postgres Master.',
      'Active write transactions were rejected by read-only replica engine nodes.'
    ],
    fixes: [
      {
        id: 'fix-1',
        name: 'Clarify Primary Write DataSource Reference',
        confidence: 97,
        description: 'Updates transaction settings to explicitly specify write routing, bypassing replica database proxies.',
        filePath: 'DocumentSummarizerService.java',
        diff: [
          { lineNum: 32, content: '@Service', type: 'normal' },
          { lineNum: 33, content: 'public class DocumentSummarizerService {', type: 'normal' },
          { lineNum: 34, content: '    @Transactional(readOnly = true) // Routing lock to RO replica', type: 'removed' },
          { lineNum: 35, content: '    public void saveMetadata(String docId, String jsonSummary) {', type: 'removed' },
          { lineNum: 34, content: '    @Transactional // Forces write permission routing on postgres master', type: 'added' },
          { lineNum: 35, content: '    public void saveMetadata(String docId, String jsonSummary) {', type: 'added' }
        ]
      }
    ],
    rationale: 'Correcting programmatic transactional routing annotations ensures metadata ingestion loops target the writeable Primary DB Cluster instead of the read-only reporting nodes.',
    similarIncidents: []
  },
  {
    id: 'INC-4099',
    title: 'Angular Admin UI KPI dashboard displaying NaN for document processing velocity when active tenant list is filtered',
    description: 'Angular Admin UI KPI dashboard displaying NaN for document processing velocity when active tenant list is filtered',
    severity: 'Low',
    status: 'Resolved',
    service: 'idp-admin-ui',
    assignee: 'Sarah J.',
    timestamp: 'Jun 02, 2026 09:30 UTC',
    createdAtText: 'Created 7h ago',
    logs: `2026-06-02 09:29:44.921 [WARN] [idp-admin-ui] Rendering metrics dashboard. Calculation resulted in: 0 / 0 documents. Value set to NaN.`,
    affectedServices: ['idp-admin-ui'],
    slaStatus: 'Under Control - 100%',
    keyFindings: [
      'A division calculation in the status metric component did not catch zero division situations, showing NaN text.'
    ],
    fixes: [
      {
        id: 'fix-1',
        name: 'Zero Division Guard in Angular Components',
        confidence: 99,
        description: 'Integrates inline checks to properly parse empty metric filter records.',
        filePath: 'velocity-kpi.component.ts',
        diff: [
          { lineNum: 74, content: '    const count = this.filteredDocuments.length;', type: 'normal' },
          { lineNum: 75, content: '    this.averageVelocity = totalDuration / count; // division lock', type: 'removed' },
          { lineNum: 75, content: '    this.averageVelocity = count > 0 ? (totalDuration / count) : 0;', type: 'added' }
        ]
      }
    ],
    rationale: 'A protective ternary fallback to default value 0 ensures layout looks fully functional even when a filter matching empty files list is selected.',
    similarIncidents: []
  },
  {
    id: 'INC-4100',
    title: 'IDP Gateway Service rejecting valid API Keys during event-driven Kafka message stream dispatch',
    description: 'IDP Gateway Service rejecting valid API Keys during event-driven Kafka message stream dispatch',
    severity: 'High',
    status: 'Active',
    service: 'idp-gateway',
    assignee: 'Unassigned',
    timestamp: 'Jun 02, 2026 08:30 UTC',
    createdAtText: 'Created 8h ago',
    logs: `2026-06-02 08:29:12.441 [WARN] [gateway-ratelimit] API Key decryption failed: missing cache payload. Returning 401 Unauthorized for client_BMW_DE.`,
    affectedServices: ['idp-gateway', 'idp-ingestion-api'],
    slaStatus: 'At Risk - 99.2%',
    keyFindings: [
      'Gateway reads active validation patterns from a Redis cache.',
      'A network boundary change broke synchronization coordinates between redis and postgres tables, resulting in false negatives.'
    ],
    fixes: [
      {
        id: 'fix-1',
        name: 'Database Failover Fallback for API Token Parsing',
        confidence: 95,
        description: 'Falls back to Postgres relational lookup query if the critical authorization keys are absent in Redis cache pools.',
        filePath: 'ApiKeyAuthenticator.java',
        diff: [
          { lineNum: 110, content: '        String secret = redisTemplate.opsForValue().get(cacheKey);', type: 'normal' },
          { lineNum: 111, content: '        if (secret == null) {', type: 'removed' },
          { lineNum: 112, content: '            throw new UnauthorizedException("API Key not matching in Cache Store");', type: 'removed' },
          { lineNum: 111, content: '        if (secret == null) {', type: 'added' },
          { lineNum: 112, content: '            // Fallback - Query Postgres and re-hydrate Redis session cache', type: 'added' },
          { lineNum: 113, content: '            ApiKeyEntity dbKey = apiKeyRepository.findByKey(cacheKey).orElseThrow(() -> new UnauthorizedException("API Key not found"));', type: 'added' },
          { lineNum: 114, content: '            redisTemplate.opsForValue().set(cacheKey, dbKey.getSecret(), Duration.ofMinutes(15));', type: 'added' },
          { lineNum: 115, content: '            secret = dbKey.getSecret();', type: 'added' },
          { lineNum: 116, content: '        }', type: 'added' }
        ]
      }
    ],
    rationale: 'Adding fallback DB validation logic ensures authentication flows stay 100% active during transient cache failures or Redis replication delays across regions.',
    similarIncidents: []
  },
  {
    id: 'INC-4101',
    title: 'Deep learning classification container failing GPU tensor loading with CUDA out of memory on large layout scans',
    description: 'Deep learning classification container failing GPU tensor loading with CUDA out of memory on large layout scans',
    severity: 'High',
    status: 'Investigating',
    service: 'idp-classifier-service',
    assignee: 'Unassigned',
    timestamp: 'Jun 02, 2026 07:15 UTC',
    createdAtText: 'Created 9h ago',
    logs: `RuntimeError: CUDA out of memory. Tried to allocate 2.45 GiB (GPU 0; 15.90 GiB total capacity; 14.12 GiB already allocated; 120.00 MiB free;...)`,
    affectedServices: ['idp-classifier-service', 'idp-pipeline-worker'],
    slaStatus: 'Under Control - 100%',
    keyFindings: [
      'The PyTorch layout model failed to unload large tensor tracking graphs, loading overhead memory on GPU host servers.',
      'Active gradients were retained during test classification phases where only standard deterministic inference calculations are required.'
    ],
    fixes: [
      {
        id: 'fix-1',
        name: 'Disable Inference Gradients & Empty CUDA Cache',
        confidence: 96,
        description: 'Enforces explicit PyTorch torch.no_grad blocks to bypass high gradient tracker retention allocations.',
        filePath: 'gpu_layout_classifier.py',
        diff: [
          { lineNum: 88, content: '    def predict_layout(self, image_tensor):', type: 'normal' },
          { lineNum: 89, content: '        predictions = self.model(image_tensor)', type: 'removed' },
          { lineNum: 89, content: '        with torch.no_grad():', type: 'added' },
          { lineNum: 90, content: '            predictions = self.model(image_tensor)', type: 'added' },
          { lineNum: 91, content: '            torch.cuda.empty_cache() # Purge residual GPU graphics mappings', type: 'added' }
        ]
      }
    ],
    rationale: 'Running predictions inside a zero-grad sandbox eliminates gradient history files instantly, suppressing continuous OOM spikes on multi-gigabyte document runs.',
    similarIncidents: []
  },
  {
    id: 'INC-4102',
    title: 'Angular HITL dashboard fails to lock document under review, allowing concurrent edits and db constraint violations',
    description: 'Angular HITL dashboard fails to lock document under review, allowing concurrent edits and db constraint violations',
    severity: 'Med',
    status: 'Investigating',
    service: 'idp-hitl-ui',
    assignee: 'Sarah J.',
    timestamp: 'Jun 02, 2026 06:15 UTC',
    createdAtText: 'Created 10h ago',
    logs: `2026-06-02 06:14:12 [ERROR] org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "idx_hitl_document_lock"`,
    affectedServices: ['idp-hitl-ui', 'idp-admin-api'],
    slaStatus: 'Under Control - 100%',
    keyFindings: [
      'Multiple reviewers loaded identical low-confidence scores concurrently from the HITL list page.',
      'The client-side viewport failed to establish active lease-lock triggers upon opening, causing duplicate metadata update attempts and DB index conflicts.'
    ],
    fixes: [
      {
        id: 'fix-1',
        name: 'Enforce Cooperative Lock Claim',
        confidence: 94,
        description: 'Issues lock requests to backend database tables prior to loading reviewer components.',
        filePath: 'hitl-document-reviewer.component.ts',
        diff: [
          { lineNum: 52, content: '  openVerificationSession(docId: string) {', type: 'normal' },
          { lineNum: 53, content: '    this.loadDocumentAssets(docId); // loads document workspace directly', type: 'removed' },
          { lineNum: 53, content: '    this.apiService.claimDocumentLock(docId).subscribe({', type: 'added' },
          { lineNum: 54, content: '       next: () => this.loadDocumentAssets(docId),', type: 'added' },
          { lineNum: 55, content: '       error: (err) => this.notificationService.showError("Document is currently being reviewed by another analyst.")', type: 'added' },
          { lineNum: 56, content: '    });', type: 'added' }
        ]
      }
    ],
    rationale: 'Acquiring dynamic lease-locks prevents race states during manual entity adjustments, keeping target queues clear of duplicate worker collision commits.',
    similarIncidents: []
  },
  {
    id: 'INC-4103',
    title: 'Skill Chaining Dispatcher failing to trigger downstream Webhook endpoints with 401 Unauthorized errors on remote host templates',
    description: 'Skill Chaining Dispatcher failing to trigger downstream Webhook endpoints with 401 Unauthorized errors on remote host templates',
    severity: 'Med',
    status: 'Active',
    service: 'idp-skill-dispatcher',
    assignee: 'Unassigned',
    timestamp: 'Jun 02, 2026 05:15 UTC',
    createdAtText: 'Created 11h ago',
    logs: `2026-06-02 05:14:55 [WARN] [idp-skill-dispatcher] Webhook dispatch to URI: https://client-endpoint.bmw.com failed. Response status: 401`,
    affectedServices: ['idp-skill-dispatcher'],
    slaStatus: 'Under Control - 100%',
    keyFindings: [
      'Outbound OAuth tokens stored in memory expired.',
      'The dispatcher service missed auto-retries or validation updates on certificate shifts, emitting outdated authorizations down the thread stream.'
    ],
    fixes: [
      {
        id: 'fix-1',
        name: 'Auto-Refresh Outbound Bearer Tokens',
        confidence: 97,
        description: 'Checks for webhook verification timeout triggers and refreshes certificates immediately upon 401 response detections.',
        filePath: 'OutboundDispatcherService.java',
        diff: [
          { lineNum: 60, content: '    private HttpHeaders createSecureHeaders() {', type: 'normal' },
          { lineNum: 61, content: '        HttpHeaders headers = new HttpHeaders();', type: 'normal' },
          { lineNum: 62, content: '        headers.setBearerAuth(cachedRemoteToken);', type: 'removed' },
          { lineNum: 62, content: '        if (isTokenExpired() || isHandshakeFailed()) {', type: 'added' },
          { lineNum: 63, content: '            cachedRemoteToken = credentialsManager.fetchFreshOutboundToken();', type: 'added' },
          { lineNum: 64, content: '        }', type: 'added' },
          { lineNum: 65, content: '        headers.setBearerAuth(cachedRemoteToken);', type: 'added' }
        ]
      }
    ],
    rationale: 'Active tenant certificate validation ensures third-party automation systems receives processed payloads continuously without credential failures.',
    similarIncidents: []
  },
  {
    id: 'INC-4104',
    title: 'Spring Boot Audit Logger throwing batch update exceptions during peak concurrent document ingestion',
    description: 'Spring Boot Audit Logger throwing batch update exceptions during peak concurrent document ingestion',
    severity: 'Low',
    status: 'Resolved',
    service: 'idp-audit-logger',
    assignee: 'Mark S.',
    timestamp: 'Jun 02, 2026 04:15 UTC',
    createdAtText: 'Created 12h ago',
    logs: `2026-06-02 04:13:01 [WARN] org.hibernate.dialect.lock.OptimisticEntityLockException: Batch update failed for audit_transactions`,
    affectedServices: ['idp-audit-logger'],
    slaStatus: 'Under Control - 100%',
    keyFindings: [
      'Ingestion streams attempted concurrent row updates to identical tenant stat slots.',
      'Hibernate pessimistic locks aborted execution under thread saturation states.'
    ],
    fixes: [
      {
        id: 'fix-1',
        name: 'Decouple Logger Writing asynchronously via Executor Pools',
        confidence: 98,
        description: 'Applies async annotations to push audit sequences onto internal buffer tasks, skipping inline database threads.',
        filePath: 'AuditLoggerWriter.java',
        diff: [
          { lineNum: 41, content: '    @Transactional', type: 'normal' },
          { lineNum: 42, content: '    public void writeAudit(AuditEntry entry) {', type: 'normal' },
          { lineNum: 43, content: '        entityManager.merge(entry); // Blocking DB transaction write', type: 'removed' },
          { lineNum: 43, content: '    @Async("auditLoggerThreadPool")', type: 'added' },
          { lineNum: 44, content: '    public void writeAudit(AuditEntry entry) {', type: 'added' },
          { lineNum: 45, content: '        auditQueueBuffer.offer(entry); // Non-blocking memory buffer', type: 'added' }
        ]
      }
    ],
    rationale: 'Decoupling structural metadata logs from direct HTTP transactions alleviates transactional blocks, ensuring document ingestion completes at peak speed.',
    similarIncidents: []
  },
  {
    id: 'INC-4105',
    title: 'IDP Portal UI fails to upload multi-page TIFFs due to missing multipart boundary configuration in nginx proxy settings',
    description: 'IDP Portal UI fails to upload multi-page TIFFs due to missing multipart boundary configuration in nginx proxy settings',
    severity: 'Med',
    status: 'Investigating',
    service: 'idp-gateway',
    assignee: 'Unassigned',
    timestamp: 'Jun 02, 2026 03:15 UTC',
    createdAtText: 'Created 13h ago',
    logs: `2026-06-02 03:14:02 [ERROR] nginx-front: multipart form boundary parameter is missing in content type header`,
    affectedServices: ['idp-gateway', 'idp-ingestion-api'],
    slaStatus: 'Under Control - 100%',
    keyFindings: [
      'A proxy routing overwrite on the ingress layout configured a hardcoded Content-Type header line.',
      'This parameter strip stripped the boundary parameter generated by client browsers, which renders raw multi-page TIFF binary fields unreadable down the pipeline.'
    ],
    fixes: [
      {
        id: 'fix-1',
        name: 'Preserve Request Content-Type Headers on Ingress Gateways',
        confidence: 96,
        description: 'Alters Nginx mapping configurations to bypass hardcoded header parameters, letting multi-boundary records pass intact.',
        filePath: 'nginx-gateway.conf',
        diff: [
          { lineNum: 15, content: '        proxy_set_header Host $host;', type: 'normal' },
          { lineNum: 16, content: '        proxy_set_header Content-Type "multipart/form-data"; // Drops boundary parameters', type: 'removed' },
          { lineNum: 16, content: '        # Pass incoming headers cleanly to preserve boundary strings', type: 'added' },
          { lineNum: 17, content: '        proxy_set_header Content-Type $http_content_type;', type: 'added' }
        ]
      }
    ],
    rationale: 'Preserving raw browser MIME request flags enables proper multiparts parser boundaries parsing, unlocking reliable high-volume multi-page files ingestion processes.',
    similarIncidents: []
  }
];

export const INITIAL_ACTIVITIES: ActivityFeedItem[] = [
  {
    id: 'act-1',
    incidentId: 'INC-4091',
    user: 'Sarah Jenkins',
    action: 'claimed this incident',
    timestamp: '2m ago',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120'
  },
  {
    id: 'act-2',
    incidentId: 'INC-4091',
    user: 'Gecko Agent',
    isAi: true,
    action: 'AI Root Cause Analysis generated',
    timestamp: '4m ago'
  },
  {
    id: 'act-3',
    incidentId: 'INC-4091',
    user: 'idp-ocr-service',
    isError: true,
    action: 'Service idp-ocr-service reported PDF rendering exception',
    timestamp: '12m ago'
  }
];
