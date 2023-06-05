import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist/build/pdf';
import { PDFPageView, EventBus, TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
} from "@fortawesome/pro-light-svg-icons";
import { StyleSheet, css } from "aphrodite";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

interface Props {
  pdfUrl: string | undefined,
  showWhenLoading: null | React.ReactNode,
  scale: number,
  onLoadSuccess?: Function,
  onLoadError?: Function,
}

interface Page {
  pdfPageView: PDFPageView,
  pageNumber: number,
  pageContainer: HTMLDivElement,
}

function PdfViewer({ pdfUrl, showWhenLoading = null, scale = 1.0, onLoadSuccess, onLoadError }: Props) {
  const [viewerWidth, setViewerWidth] = useState<number>(0); // The width of the container 
  const [currentScale, setCurrentScale] = useState<number>(scale);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReadyToRender, setIsReadyToRender] = useState<boolean>(false); 
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [nextPage, setNextPage] = useState<number>(1); 
  const [pagesLoaded, setPagesLoaded] = useState<Page[]>([]);
  const [pagesLoading, setPagesLoading] = useState<number[]>([]);
  const observer = useRef<HTMLDivElement>(null); 
  const [hasLoadError, setHasLoadError] = useState<boolean>(false);
  const eventBus = new EventBus();


  
  const loadPage = useCallback(async (pageNum) => {
    const isAlreadyLoadingOrLoaded = pagesLoading.includes(pageNum) || pagesLoaded.filter(p => p.pageNumber == pageNum).length > 0;

    if (pdfDocument && pageNum <= numPages && isReadyToRender && !isAlreadyLoadingOrLoaded) {
      setPagesLoading([...pagesLoading, pageNum]);
    
      const page = await pdfDocument.getPage(pageNum);
      
      // Get viewport with scale 1 to find original page size
      const unscaledViewport = page.getViewport({ scale: 1 });
      // Calculate the new scale
      const _scale = viewerWidth / unscaledViewport.width;
      // Get the scaled viewport
      const viewport = page.getViewport({ scale: _scale });
      
      const pageContainer = document.createElement('div');
      pageContainer.style.position = 'relative';
      
      const pdfPageView = new PDFPageView({
        container: pageContainer,
        id: pageNum,
        scale: _scale,
        defaultViewport: viewport,
        eventBus,
        textLayerMode: 2,
      });
  
      pdfPageView.setPdfPage(page);
      pdfPageView.div.className = css(styles.page);
      await pdfPageView.draw();
  
  
      if (containerRef.current) {
        containerRef.current.appendChild(pageContainer);
      }
      
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pageNum < numPages) {
          setNextPage(pageNum + 1);
        }
      }, {
        rootMargin: "0px 0px -100% 0px"
      });
      observer.current.observe(pageContainer);

      setPagesLoaded([...pagesLoaded, {
        pdfPageView,
        pageNumber: pageNum,
        pageContainer,
      }]);
      setPagesLoading(pagesLoading.filter((page) => page !== pageNum));      
    }
  }, [pdfDocument, numPages, scale, eventBus, isReadyToRender]);

  useEffect(() => {
    const loadDocument = async () => {
      let pdfDocument;
      try {
        const loadingTask = getDocument(pdfUrl);
        pdfDocument = await loadingTask.promise;
        setPdfDocument(pdfDocument);
        setNumPages(pdfDocument.numPages);
      }
      catch(error) {
        onLoadError && onLoadError(error);
        setHasLoadError(true);
        console.log('error loading pdf', error)
      }
    };

    loadDocument();
  }, [pdfUrl]);

  
  useLayoutEffect(() => {
    function updateWidth() {
      const clientWidth = Number(containerRef.current?.clientWidth);
      if (clientWidth > 0) {
        setViewerWidth(clientWidth);
        setIsReadyToRender(true);
      }
    }

    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (pdfDocument && nextPage <= numPages) {
      
      loadPage(nextPage);
    }
  }, [nextPage, loadPage, pdfDocument, numPages, viewerWidth, currentScale]); 









  // useEffect(() => {
  //   if (scale !== currentScale) {
  //     setCurrentScale(scale);
  
  //     const _pagesLoading = [...pagesLoaded.map(p => p.pageNumber)];
  //     setPagesLoading(_pagesLoading);

  //     pagesLoaded.forEach(async (page:Page) => {
  //       page.pdfPageView.update({ scale });
  //       await page.pdfPageView.draw();
  //     });
  //   }
  // }, [scale]);
  

  if (hasLoadError) {
    return (
      <div className={css(styles.error)}>
        <FontAwesomeIcon icon={faCircleExclamation} style={{ fontSize: 44 }} />
        <span style={{ fontSize: 22 }}>
          There was an error loading the PDF.
        </span>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <div ref={containerRef} style={{  width: 898, overflow: "hidden", boxSizing: "border-box" }}></div>
      {(pagesLoading.length > 0 || !isReadyToRender) && showWhenLoading}
    </div>
  );
}

const styles = StyleSheet.create({
  error: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    alignItems: "center",
    rowGap: "15px",
    justifyContent: "center",
    marginTop: "20%",
  },  
  page: {
    margin: "0 auto"
  }
})

export default PdfViewer;
